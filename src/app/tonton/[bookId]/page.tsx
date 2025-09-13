import { config } from "@/lib/config";
import { fetchStream } from "@/lib/dramabox";
import Client from "./WatchClient";

export async function generateMetadata({
  params,
}: {
  params: { bookId: string };
}) {
  const { bookId } = params;

  const { data } = await fetchStream(bookId, 1);
  const d = data?.data ?? {};

  return {
    title: `Tonton ${d.bookName ?? "Drama"} - ${config.PROJECT_NAME}`,
    description: d.introduction ?? `Tonton ${d.bookName ?? "Drama"}`,
    keywords: d.tags ?? [],
    openGraph: {
      images: [
        {
          url: d.bookCover ?? "",
          width: 800,
          height: 600,
          alt: d.bookName ?? "Drama",
          type: "image/jpeg",
        },
      ],
    },
  };
}

export default function Page({ params }: { params: { bookId: string } }) {
  return <Client bookId={params.bookId} />;
}
