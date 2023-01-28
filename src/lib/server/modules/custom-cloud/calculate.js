export const calculateTotal = (deals) => {
    const total = deals.filter((s) => s.dealStage !== "10" && s.dealStage !== "9" && s.dealStage !== "8").reduce((acc, deal) => {
        return acc + parseFloat(deal.amount);
    }, 0);
    return total;
}