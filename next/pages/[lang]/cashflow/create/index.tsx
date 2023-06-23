import { Layout } from "@/ui";
import FormData from "@/components/cashflow/form-data";
import { getDictionary } from "../../dictionaries";
import { useEffect, useState } from "react";

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

const Create = ({ dict, locale }: any) => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 64);
  }, []);

  return (
    <Layout noBottomNav>
      <FormData dict={dict} locale={locale} />
    </Layout>
  );
};

export default Create;
