export function validateNews(title: string, body: string): string[] {
  const errors: string[] = [];
  if (!title.trim()) errors.push("News title cannot be empty.");
  if (body.trim().length < 20) errors.push("News body must be at least 20 characters.");
  return errors;
}

export function validateComment(text: string): string[] {
  const errors: string[] = [];
  if (!text.trim()) errors.push("Comment text cannot be empty.");
  return errors;
}
