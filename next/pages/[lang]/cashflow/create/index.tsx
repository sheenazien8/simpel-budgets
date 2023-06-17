import { Layout } from "@/ui";
import FormData from "@/components/cashflow/form-data";
import { getDictionary } from "../../dictionaries";

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

const Create = ({dict, locale}: any) => {
  return (
    <Layout>
      <FormData
        dict={dict}
        locale={locale}
      />
    </Layout>
  );
};

export default Create;
