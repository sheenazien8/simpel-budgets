import {
  Button,
  CardList,
  Dropdown,
  Layout,
  Modal,
  Price,
  Select,
  Text,
} from "@/ui";
import { useEffect, useState } from "react";
import { getDictionary } from "../../dictionaries";
import { useAccountAction, useDebtActions } from "@/actions";
import { MAccount, MDebt, MDebtPayment, RDebtPayment } from "@/models";
import { BanknotesIcon, PencilIcon } from "@heroicons/react/24/outline";
import { formatMoney, toastProgress, useHashRouteToggle } from "@/utils/helper";
import { useRouter } from "next/router";
import { Formik } from "formik";
import { useConfirm } from "@/packages/confirm";
import { TrashIcon } from "@heroicons/react/24/outline";

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
  const { confirm } = useConfirm();
  const [height, setHeight] = useState(0);
  const { detail, addDebtPayment, destroy, destroyPayment } = useDebtActions();
  const { get: getAccount } = useAccountAction();
  const [debtPayments, setDebtPayment] = useState<MDebtPayment[]>();
  const [debt, setDebt] = useState<MDebt>();
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
    setLoadingSubmit(true);
    try {
      await addDebtPayment(props.id, values, setErrors);
      router.push(`/${router.query?.lang}/debt/${props.id}`);
      setLoadingSubmit(false);
    } catch (error) {
      console.log(error);
      setLoadingSubmit(false);
    }
  };

  const load = async () => {
    const res = await detail(props.id);
    setDebtPayment(res?.data?.data?.payments);
    setDebt(res?.data?.data);
    const accounts = await getAccount();
    setAccounts(accounts?.data?.data?.data);
    toggleActive(false);
  };

  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 250);
    load();
  }, [router]);

  return (
    <Layout>
      <>
        <div className="flex justify-between items-center ">
          <div>
            <p className="font-semibold text-lg">
              {debt?.type == 1 ? "Hutang" : "Piutang"}{" "}
            </p>
            <p className="text-gray-600 w-3/4 text-xs">
              Aku {debt?.type == 1 ? "meminjam" : "meminjamkan"} uang ke{" "}
              {debt?.name} sebesar {formatMoney(debt?.amount)}
              <span className="ml-2 italic text-xs text-gray-400">
                {debt?.status == 1 ? "Sudah Lunas" : "Belum Lunas"}
              </span>
            </p>
            {debt?.description && (
              <p className="text-gray-600 text-xs italic mt-2">
                {debt?.description}
              </p>
            )}
          </div>
          <Dropdown
            options={[
              { label: "Ubah data", onClick: () => {} },
              {
                label: `Kurangi ${debt?.type == 1 ? "hutang" : "piutang"}`,
                onClick: () => {
                  toggleActive(true);
                  setErrors(undefined);
                },
              },
              {
                label: (
                  <p>
                    Tambah hutang{" "}
                    <span className="text-xs italic">(Comming soon)</span>
                  </p>
                ),
                onClick: () => {},
              },
              {
                label: "Hapus",
                onClick: () => {
                  confirm({
                    title: "Hapus Hutang/Piutang",
                    description: `Apakah anda yakin ingin menghapus hutang/piutang ini?`,
                    yes: () => {
                      if (props.id != undefined) {
                        toastProgress(
                          destroy(props?.id),
                          `Menghapus hutang/piutang`,
                          () => {
                            router.push(`/${router.query?.lang}/debt`);
                          },
                        );
                      }
                    },
                    no: () => {},
                  });
                },
              },
            ]}
          />
        </div>
        <ul
          style={{ height: height }}
          role="list"
          className={`mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 overflow-x-scroll`}
        >
          {debtPayments?.map((debtPayment: MDebtPayment, index: number) => (
            <CardList
              key={index}
              icon={<BanknotesIcon className="h-5 w-5 text-white" />}
              title={formatMoney(debtPayment?.amount)}
              details={[
                "Tanggal: " + debtPayment?.date,
                <div key={index}>
                  <div className="bg-gray-100 h-1 rounded-md my-2" />
                  <div className="flex gap-x-2 flex-row-reverse">
                    <Button
                      type="button"
                      size="sm"
                      color="danger"
                      onClick={() => {
                        confirm({
                          title: "Hapus pembayaran",
                          description: `Apakah anda yakin ingin menghapus pembayaran ini?`,
                          yes: () => {
                            if (debtPayment.id != undefined) {
                              toastProgress(
                                destroyPayment(props?.id, debtPayment?.id),
                                `Menghapus pembayaran hutang/piutang`,
                                () => {
                                  router.push(
                                    `/${router.query?.lang}/debt/${props.id}`,
                                  );
                                },
                              );
                            }
                          },
                          no: () => {},
                        });
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>,
              ]}
            />
          ))}
        </ul>
        <Modal
          open={isOpen}
          setOpen={(status) => toggleActive(status)}
          title="Pembayaran Hutang/Piutang"
        >
          <Formik
            initialValues={{
              amount: 0,
              date: "",
              account_id: "",
            }}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <Select
                  label="Akun Target"
                  formik={formik}
                  name={"account_id"}
                  errors={String(errors?.account_id ?? "")}
                  value={String(formik.values?.account_id ?? "")}
                  options={accounts}
                />
                <Text
                  label="Tanggal"
                  formik={formik}
                  name={"date"}
                  errors={errors?.date}
                  value={formik.values.date}
                  type="date"
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
