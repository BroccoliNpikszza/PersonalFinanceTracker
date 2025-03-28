import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "../app/dashboard/data.json"
import { CustomTable } from "@/components/custom-table"
const accData ={
  balance : 12192.12,
  expense : 2192.12,
  savings : 3192.12,
  growthRate:4,
}
const transactions = [
    { id: 1, paymentStatus: "Completed", totalAmount: 50, paymentMethod: "Credit Card" },
    { id: 2, paymentStatus: "Pending", totalAmount: 75.5, paymentMethod: "PayPal" },
]
export default function Home(){
    return (
        <>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards balance={accData.balance} expense={accData.expense} savings={accData.savings} growthRate={accData.growthRate}/>
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <CustomTable transactions={transactions} />
            </div>
          </div>
        </div> 
        </>
    )
}