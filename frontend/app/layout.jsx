import "./globals.css";

export const metadata = {
  title: "ZIGGURAT | Curated Fine Art, Sculpture & Digital Editions",
  description: "An exclusive international gallery offering original museum-grade oil paintings, master bronze sculptures, and rare generative digital art.",
  keywords: ["fine art", "buy oil painting", "original sculpture", "digital art NFT", "contemporary art gallery"],
  openGraph: {
    title: "ZIGGURAT Art Gallery",
    description: "Acquire original paintings, monumental sculptures, and certified digital art editions.",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
