// components/AdBanner.tsx

import Image from "next/image"
import { getActiveAds } from "../lib/getAds"

type Props = {
  position: "top" | "left" | "right"
}

export default async function AdBanner({ position }: Props) {
  const ads = await getActiveAds(position)

  if (!ads.length) return null


  const containerClass = position === "top"
    ? "w-full flex flex-row gap-2"
    : "flex flex-col gap-2"

 
  const sideWidth = "w-48" // Örnek: 12rem genişlik

  return (
    <div className={containerClass}>
      {ads.map(ad => (
        ad.image_url ? (
          <a
            key={ad.id}
            href={ad.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block border rounded shadow overflow-hidden h-[200px] ${
              position === "top" ? "flex-1" : sideWidth
            }`}
          >
            <Image
              src={ad.image_url}
              alt={ad.title ?? "Reklam"}
              width={300}
              height={100}
              className="w-full h-full object-cover"
            />
          </a>
        ) : null
      ))}
    </div>
  )
}
