/* ================= PRICE WITH DISCOUNT ================= */
export const priceWithDiscount = (price, discount = 0) => {
  const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100);
  return Number(price) - discountAmount;
};