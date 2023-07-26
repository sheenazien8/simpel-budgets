import {
  Layout,
} from "@/ui";
import { getDictionary } from "../../dictionaries";

interface IPage {
  dict: any;
  locale: string;
  id: string;
}

export async function getServerSideProps(props: any) {
  const dict = await getDictionary(props.params.lang);
  return {
    props: {
      dict: dict,
      locale: props.params.lang,
      id: props.params.id,
    },
  };
}

export default function Page(props: IPage) {
  return (
    <Layout>
      <>
      </>
    </Layout>
  );
}

