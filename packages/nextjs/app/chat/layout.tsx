import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
export const metadata = getMetadata({
  title: "8-Bit Bot",
  description: "8-Bit Bot at your service",
});
const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
export default ChatPageLayout;