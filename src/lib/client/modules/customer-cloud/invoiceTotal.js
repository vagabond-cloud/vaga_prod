export const grandTotal = (items, settings) => {
    settings = settings || { country: 'en-US', currency: 'USD' }
    let total = 0;
    let vat = 0;
    let discount = 0;

    items.forEach(item => {
        const amount = parseFloat(item.amount) || 0;
        const price = parseFloat(item.price) || 0;
        const itemVat = parseFloat(item.vat) || settings.vat || 0;
        const itemDiscount = parseFloat(item.discount) || 0;

        total += (amount * price) + (amount * price * itemVat / 100) - itemDiscount;
        vat += amount * price * itemVat / 100;
        discount += itemDiscount;
    });

    const grandTotal = parseFloat(total).toLocaleString(settings.country, { style: 'currency', currency: settings.currency });
    const gradVat = parseFloat(vat).toLocaleString(settings.country, { style: 'currency', currency: settings.currency });
    const grandDiscount = parseFloat(discount).toLocaleString(settings.country, { style: 'currency', currency: settings.currency });

    return { grandTotal, gradVat, grandDiscount };
};
