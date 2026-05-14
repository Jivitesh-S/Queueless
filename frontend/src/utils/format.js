export const minutesLabel = (value) => `${Math.max(0, value || 0)} min`;

export const confidenceLabel = (value) => `${Math.round((value || 0) * 100)}% confidence`;
