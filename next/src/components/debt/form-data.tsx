import { Formik } from "formik";
import { MDebt, RDebt } from "../../models/src/debt";
import { toastProgress } from "@/utils/helper";
import { useEffect, useState } from "react";
import { useAccountAction, useDebtActions } from "@/actions";
import { MAccount } from "@/models";
import { Button, Price, Select, Text } from "@/ui";
import { useRouter } from "next/router";

interface IFormData {
  dict: any;
  initialValues?: MDebt | RDebt;
  toggleActive?: (status?: boolean) => void;
}

const FormData = (props: IFormData) => {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [errors, setErrors] = useState<RDebt>();
  const { create } = useDebtActions();
  const { get: getAccount } = useAccountAction();
  const router = useRouter();
  const [accountData, setAccounts] = useState<MAccount[]>();
  const accounts = [{ value: "", label: "Pilih Akun" }].concat(
    (accountData ?? []).map((account) => ({
      value: String(account.id),
      label: `${account.name}`,
    })),
  );
  const onSubmit = async (values: RDebt) => {
    setLoadingSubmit(true);
    toastProgress(
      create(values, setErrors),
      "Menambahkan utang/piutang",
      () => {
        router.push(`/${router.query.lang}/debt`);
      },
      () => setLoadingSubmit(false),
    );
  };
  const load = async () => {
    const accounts = await getAccount();
    setAccounts(accounts?.data?.data?.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Formik
      initialValues={props.initialValues as RDebt}
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
                label: "Hutang (Aku meminjam)",
              },
              {
                value: 2,
                label: "Piutang (Aku meminjamkan)",
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
  );
};

export default FormData;
