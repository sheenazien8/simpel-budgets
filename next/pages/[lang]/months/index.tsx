import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useMonthAction } from "@/actions";
import { MMonth, RMonth } from "@/models";
import { formatMoney, toastProgress, useHashRouteToggle } from "@/utils/helper";
import { Button, CardList, EmptyState, Layout, Modal } from "@/ui";
import FormData from "@/components/months/form-data";
import { getDictionary } from "../dictionaries";
import { useRouter } from "next/router";

interface IMonth {
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

export default function Page(props: IMonth) {
  const { get, create, detail, update, destroy } = useMonthAction();
  const [months, setMonths] = useState<MMonth[]>();
  const [editData, setEditData] = useState<MMonth>();
  const [errors, setErrors] = useState<RMonth>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingActivate, setLoadingActivate] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (values: RMonth) => {
    setLoadingSubmit(true);
    let progress: any;
    if (!editData?.id) {
      progress = create(values, setErrors);
    } else {
      progress = update(editData.id, values, setErrors);
    }
    toastProgress(
      progress,
      `${editData?.id ? "Perubahan" : "Pembuatan"} bulan`,
      () => {
        setLoadingSubmit(false);
        toggleActive(false);
        load();
        setEditData(undefined);
      },
      () => setLoadingSubmit(false),
    );
  };

  const onDelete = async () => {
    setLoadingDelete(true);
    if (editData?.id != undefined) {
      toastProgress(
        destroy(editData?.id),
        "Menghapus bulan",
        () => {
          setLoadingDelete(false);
          toggleActive(false);
          load();
          setEditData(undefined);
        },
        () => setLoadingDelete(false),
      );
    }
  };

  const onUpdateStatus = async () => {
    setLoadingActivate(true);
    if (editData?.id != undefined) {
      toastProgress(
        update(
          editData?.id,
          {
            name: editData?.name,
            year: editData?.year,
            status: !(Number(editData?.status) == 1),
          },
          setErrors,
        ),
        "Perubahan status bulan",
        () => {
          setLoadingActivate(false);
          toggleActive(false);
          load();
          setEditData(undefined);
        },
        () => setLoadingActivate(false),
      );
    }
  };

  const load = () => {
    setLoading(true);
    get().then((months) => {
      setMonths(months.data.data);
      setLoading(false);
    });
    toggleActive(false);
  };

  useEffect(() => {
    load();
  }, []);

  const Results = (
    <>
      {months?.length == 0 && (
        <EmptyState
          title="Data bulan kosong"
          description="Rencanakan anggaran bulan anda di bulan tertentu"
          button={
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => {
                  toggleActive(true);
                  setEditData(undefined);
                }}
              >
                <PlusIcon className="h-5" /> Tambah Bulan
              </Button>
            </div>
          }
        />
      )}
      {months?.map((month, index) => (
        <CardList
          bgColor={
            Number(month.over_budget) > 0 ? "bg-yellow-600" : "bg-green-600"
          }
          key={index}
          title={
            <div className="flex justify-between">
              <p>{month.name}</p>
              <div className="grid grid-cols-1">
                <p>{formatMoney(month.budgets_sum_nominal)}</p>
                <p className="text-xs text-right text-red-600">
                  -{formatMoney(month.transactions_sum_nominal)}
                </p>
                {Number(month.over_budget) > 0 ? (
                  <p className="text-xs text-left italic text-yellow-600">
                    {month.over_budget_desc}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          }
          icon={<CalendarIcon className="w-6" />}
          details={[
            month.year,
            <span key={index} className="italic">
              {Number(month.status) ? "Aktif" : "Nonaktif"}
            </span>,
          ]}
          onClick={async () => {
            const monthData = await detail(month.id);
            toggleActive(true);
            setEditData(monthData.data.data);
            setErrors(undefined);
          }}
        />
      ))}
    </>
  );

  return (
    <Layout title="Bulan" noBottomNav loading={!months}>
      <>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500">Daftar bulan</h2>
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              value="Tambah"
              onClick={() => {
                toggleActive(true);
                setEditData(undefined);
              }}
            >
              <PlusIcon className="h-5" />
            </button>
          </div>
          <ul
            role="list"
            className="mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {!loading ? (
              Results
            ) : (
              <h2 className="text-center my-auto">Loading...</h2>
            )}
          </ul>
        </div>
        <Modal
          open={isOpen}
          setOpen={(status) => {
            toggleActive(status);
            setEditData(undefined);
            setErrors(undefined);
          }}
          title="Tambah Bulan"
          actions={
            editData
              ? [
                  {
                    label: "Lihat anggaran bulan ini",
                    onClick: () => router.push(`/${props.locale}/budgets?month_id=${editData?.id}`),
                  },
                ]
              : []
          }
        >
          <FormData
            onSubmit={onSubmit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            errors={errors}
            initialValues={editData}
            loadingSubmit={loadingSubmit}
            loadingDelete={loadingDelete}
            loadingActivate={loadingActivate}
          />
        </Modal>
      </>
    </Layout>
  );
}
