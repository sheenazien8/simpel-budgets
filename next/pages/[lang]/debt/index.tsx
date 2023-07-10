import { Layout } from "@/ui";
import { useEffect, useState } from "react";
import { getDictionary } from "../dictionaries";

interface IPage {
  dict: any;
  locale: string;
}

export async function getStaticProps(props: any) {
  const dict = await getDictionary(props.params.lang);
  return {
    props: {
      dict: dict,
      locale: props.params.lang,
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [{ params: { lang: "id" } }, { params: { lang: "en" } }],
    fallback: false,
  };
}

export default function Page(props: IPage) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 200);
  }, []);

  return (
    <Layout title="Debt">
      <div
        className="flex flex-col gap-y-4 overflow-x-scroll"
        style={{ height: height }}
      >
        <ul></ul>
      </div>
    </Layout>
  );
}
