export const inr = (value) => Number(value || 0).toLocaleString("en-IN");

export const GST_RATE = 0.18;

export const withGst = (price) => Math.round(Number(price || 0) * (1 + GST_RATE));
