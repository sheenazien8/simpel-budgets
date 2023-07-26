import {
  Button,
  CardList,
  EmptyState,
  Layout,
  Modal,
  Price,
  Select,
  Text,
} from "@/ui";
import { useEffect, useState } from "react";
import { getDictionary } from "../../dictionaries";
import { useAccountAction, useDebtActions, useDebtPaymentActions } from "@/actions";
import { MAccount, MDebt, RDebtPayment } from "@/models";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { formatMoney, toastProgress, useHashRouteToggle } from "@/utils/helper";
import { useRouter } from "next/router";
import { Formik } from "formik";

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
  const [height, setHeight] = useState(0);
  const { get, create, detail } = useDebtActions();
  const { get: getAccount } = useAccountAction();
  const [debts, setDebt] = useState<MDebt>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [errors, setErrors] = useState<RDebtPayment>();
  const [accountData, setAccounts] = useState<MAccount[]>();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const router = useRouter();

  const accounts = [{ value: "", label: "Pilih Akun" }].concat(
    (accountData ?? []).map((account) => ({
      value: String(account.id),
      label: `${account.name}`,
    })),
  );

  const onSubmit = async (values: RDebtPayment) => {
    toastProgress(
      create(values, setErrors),
      "Menambahkan utang/piutang",
      () => {
        load();
        toggleActive(false);
        setErrors(undefined);
      },
      () => setLoadingSubmit(false),
    );
  };

  const load = async () => {
    const res = await detail(props.id);
    console.log(res.data.data?.payments);
    setDebt(res.data.data);
    const accounts = await getAccount();
    setAccounts(accounts?.data?.data?.data);
  };

  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 250);
    load();
  }, []);

  return (
    <Layout>
      <>
        <div>
        </div>
        <div className="flex justify-between items-center flex-row-reverse">
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            value="Tambah"
            onClick={() => {
              toggleActive(true);
              setErrors(undefined);
            }}
          >
            <PlusIcon className="h-5" />
          </button>
        </div>
        <ul
          style={{ height: height }}
          role="list"
          className={`mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 overflow-x-scroll`}
        >
        </ul>
        <Modal
          open={isOpen}
          setOpen={(status) => toggleActive(status)}
          title={"Tambah utang/piutang"}
        >
          <Formik
            initialValues={{
              type: "2",
            }}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <Select
                  label="Akun"
                  formik={formik}
                  name={"account_id"}
                  errors={String(errors?.account_id ?? "")}
                  value={String(formik.values?.account_id ?? "")}
                  options={accounts}
                />
                <Select
                  label="Hutang/Piutang"
                  formik={formik}
                  name={"type"}
                  errors={String(errors?.type ?? "")}
                  value={String(formik.values?.type ?? "1")}
                  options={[
                    {
                      value: 1,
                      label: "Hutang",
                    },
                    {
                      value: 2,
                      label: "Piutang",
                    },
                  ]}
                />
                <Text
                  label="Nama"
                  formik={formik}
                  name={"name"}
                  errors={errors?.name}
                  value={formik.values.name}
                />
                <Text
                  label="Deskripsi"
                  formik={formik}
                  name={"description"}
                  errors={errors?.description}
                  value={formik.values.description}
                />
                <Price
                  label="Nominal"
                  formik={formik}
                  name={"amount"}
                  errors={errors?.amount}
                  value={formik.values.amount}
                  currency="Rp"
                />
                <div className="flex gap-x-2">
                  <Button loading={loadingSubmit} type="submit" block>
                    Simpan
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Modal>
      </>
    </Layout>
  );
}

