import { Layout } from "@/ui";
import FormData from "@/components/cashflow/form-data";
import { getDictionary } from "../../dictionaries";
import { useCashflowAction } from "@/actions";
import { MCashflow } from "@/models";
import { useEffect, useState } from "react";

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

interface IEdit {
  dict: any;
  locale: string;
  id: number;
}

const Edit = ({ dict, locale, id }: IEdit) => {
  const { detail } = useCashflowAction();
  const [cashflow, setCashflow] = useState<MCashflow>();
  const load = async () => {
    const cashflow = await detail(id);
    setCashflow(cashflow.data.data ?? undefined);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout loading={!cashflow} noBottomNav>
      <FormData
        dict={dict}
        locale={locale}
        initialValues={cashflow}
        id={cashflow?.id}
      />
    </Layout>
  );
};

export default Edit;
