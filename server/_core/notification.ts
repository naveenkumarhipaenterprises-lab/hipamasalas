export async function notifyOwner({ title, content }: { title: string; content: string }) {
  console.info(`[Website enquiry] ${title}\n${content}`);
  return false;
}
