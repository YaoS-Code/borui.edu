import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
}

const Seo: React.FC<SeoProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title} | Borui Education</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={`${title} | Borui Education`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Seo;
