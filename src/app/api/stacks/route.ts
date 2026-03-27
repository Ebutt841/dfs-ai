import { NextRequest, NextResponse } from "next/server";
import { getNFLSalaries, PlayerSalary } from "@/lib/salaries";

export async function GET() {
  try {
    const salaryData = await getNFLSalaries();
    const players = salaryData.draftkings;
    
    // Find QBs and their stackable WRs/TEs
    const qbs = players.filter(p => p.position === 'QB');
    const stacks: any[] = [];
    
    for (const qb of qbs) {
      // Find WRs and TEs from same team
      const teammates = players.filter(p => 
        p.team === qb.team && 
        (p.position === 'WR' || p.position === 'TE') &&
        p.name !== qb.name
      );
      
      // Sort by salary
      teammates.sort((a, b) => b.salary - a.salary);
      
      // Calculate stack value
      const topTargets = teammates.slice(0, 3).map(t => ({
        name: t.name,
        position: t.position,
        salary: t.salary
      }));
      
      if (topTargets.length > 0) {
        stacks.push({
          quarterback: {
            name: qb.name,
            salary: qb.salary,
            opponent: qb.opponent
          },
          stackableTargets: topTargets,
          totalStackSalary: qb.salary + topTargets.reduce((sum, t) => sum + t.salary, 0),
          value: calculateStackValue(qb, teammates)
        });
      }
    }
    
    // Sort by value score
    stacks.sort((a, b) => b.value.score - a.value.score);
    
    return NextResponse.json({
      sport: salaryData.sport,
      week: salaryData.week,
      year: salaryData.year,
      stacks: stacks.slice(0, 10)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function calculateStackValue(qb: PlayerSalary, teammates: PlayerSalary[]) {
  const topTarget = teammates[0];
  const secondTarget = teammates[1];
  
  return {
    score: topTarget ? (topTarget.salary / 1000) * 10 : 0,
    description: topTarget 
      ? `Stack ${qb.name} with ${topTarget.name} for $${(qb.salary + topTarget.salary).toLocaleString()}`
      : "No stack targets available",
    correlation: "High - QB and receiver benefit from same offense",
    ownershipNote: topTarget 
      ? `${qb.name}/${topTarget.name} stack likely to be popular in GPPs`
      : ""
  };
}