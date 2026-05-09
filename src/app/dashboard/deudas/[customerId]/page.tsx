import { CustomerDebtDetail } from "@/src/app/modules/debts/components/CustomerDebtDetail"


export default async function CustomerDebtPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const { customerId } = await params
  return <CustomerDebtDetail customerId={customerId} />
}