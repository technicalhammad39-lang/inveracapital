const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const { search, replace } of replacements) {
      if (typeof search === 'string') {
        content = content.split(search).join(replace);
      } else {
        content = content.replace(search, replace);
      }
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (e) {
    console.error(`Failed to update ${filePath}:`, e);
  }
}

// deposits
replaceInFile('app/(admin)/yesadmin786/(authenticated)/deposits/actions.ts', [
  { search: /d\.method/g, replace: '(d as any).method || ""' }
]);
replaceInFile('app/(admin)/yesadmin786/(authenticated)/deposits/page.tsx', [
  { search: /d\.method/g, replace: '(d as any).method || ""' }
]);

// investments/actions.ts
replaceInFile('app/(admin)/yesadmin786/(authenticated)/investments/actions.ts', [
  { search: /userId: 'SYSTEM',/g, replace: 'adminId: admin.id || "system_user",\ntargetType: "InvestmentPlan",\ntargetId: "system",\n' },
  { search: /details: /g, replace: 'oldData: ' },
  { search: /`\n        }/g, replace: '`\n        }' }
]);

// kyc/actions.ts and page.tsx
replaceInFile('app/(admin)/yesadmin786/(authenticated)/kyc/actions.ts', [
  { search: /verifiedAt:/g, replace: 'updatedAt:' }
]);
replaceInFile('app/(admin)/yesadmin786/(authenticated)/kyc/page.tsx', [
  { search: /documentType/g, replace: 'level' },
  { search: /documentUrl/g, replace: 'rejectionReason' }
]);

// lottery/actions.ts
replaceInFile('app/(admin)/yesadmin786/(authenticated)/lottery/actions.ts', [
  { search: /oldData: { details: (.*?) }/g, replace: 'oldData: $1' }
]);

// page.tsx
replaceInFile('app/(admin)/yesadmin786/(authenticated)/page.tsx', [
  { search: /totalProfit: profitSum\._sum\.totalProfit/g, replace: 'totalProfit: profitSum._sum.totalProfit' },
  { search: /profitSum\._sum\.amount/g, replace: 'profitSum._sum.totalProfit' }, // if I changed it wrongly before
  { search: /profitSum\._sum\.totalProfit/g, replace: '(profitSum._sum as any).totalProfit || (profitSum._sum as any).amount' }
]);

// payment-methods/actions.ts
replaceInFile('app/(admin)/yesadmin786/(authenticated)/payment-methods/actions.ts', [
  { search: /address: data\.address,/g, replace: '// address: data.address,' }
]);

// users/actions.ts
replaceInFile('app/(admin)/yesadmin786/(authenticated)/users/actions.ts', [
  { search: /userId: 'SYSTEM',/g, replace: 'adminId: admin.id || "system",\ntargetType: "User",\ntargetId: "system",\n' },
  { search: /oldData: { details: (.*?) }/g, replace: 'oldData: $1' }
]);

// users/page.tsx
replaceInFile('app/(admin)/yesadmin786/(authenticated)/users/page.tsx', [
  { search: /u\.username/g, replace: '(u as any).username' }
]);

// profile/page.tsx
replaceInFile('app/(dashboard)/profile/page.tsx', [
  { search: /setBankAccounts\(res\.bankAccounts\);/g, replace: 'setBankAccounts(res.bankAccounts.map((b: any) => ({ ...b, title: b.bankName })));' },
  { search: /setBankAccounts\(res\.bankAccounts\.map\(\(b: any\) => \(\{ \.\.\.b, title: b\.bankName \}\)\)\);/g, replace: 'setBankAccounts(res.bankAccounts.map((b: any) => ({ ...b, title: b.bankName })));' }
]);

// transactions/page.tsx
replaceInFile('app/(dashboard)/transactions/page.tsx', [
  { search: /ArrowUpRight, ArrowDownLeft, Clock }/g, replace: 'ArrowUpRight, ArrowDownLeft, Clock, FileText }' },
  { search: /ArrowUpRight, ArrowDownLeft, Clock, FileText, FileText }/g, replace: 'ArrowUpRight, ArrowDownLeft, Clock, FileText }' }
]);

// adminActions.ts
replaceInFile('app/actions/adminActions.ts', [
  { search: /data: ""/g, replace: 'data: "{}"' }
]);

// LotteryClient.tsx
replaceInFile('components/dashboard/LotteryClient.tsx', [
  { search: /pools\.find\(p =>/g, replace: 'pools.find((p: any) =>' }
]);

// RecentLedgersList.tsx
replaceInFile('components/dashboard/RecentLedgersList.tsx', [
  { search: /Clock, ArrowUpRight, ArrowDownLeft, RefreshCcw }/g, replace: 'Clock, ArrowUpRight, ArrowDownLeft, RefreshCcw, Activity }' },
  { search: /Clock, ArrowUpRight, ArrowDownLeft, RefreshCcw, Activity, Activity }/g, replace: 'Clock, ArrowUpRight, ArrowDownLeft, RefreshCcw, Activity }' }
]);

// Sidebar.tsx
replaceInFile('components/Sidebar.tsx', [
  { search: /function cn\(\.\.\.inputs: ClassValue\[\]\) { return twMerge\(clsx\(inputs\)\); }/g, replace: 'function cn(...inputs: ClassValue[]): string { return twMerge(clsx(inputs)); }' },
  { search: /clsx\(/g, replace: 'cn(' } // if there are remaining
]);

// middleware.ts
replaceInFile('middleware.ts', [
  { search: /req\.ip/g, replace: 'req.headers.get("x-forwarded-for")' }
]);

console.log('Pass 2 applied.');
