import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { PlusIcon } from "@heroicons/react/20/solid";
import CardList from "../Components/List";
import Modal from "../Components/Modal";
import { useDebtsAndReceivablesAction } from "../actions";
import { MDebtsAndReceivables, RDebtsAndReceivables } from "../models";
import {
  formatMoney,
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { EmptyState } from "../Components/EmptyState";
import { Link } from "@inertiajs/inertia-react";
import Button from "../Components/Button";

interface IDebtsAndReceivables {}

const List = () => {
  const [debtsAndReceivables, setDebtsAndReceivabless] = useState<MDebtsAndReceivables[]>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [editData, setEditData] = useState<MDebtsAndReceivables>();
  const [errors, setErrors] = useState<RDebtsAndReceivables>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingActivate, setLoadingActivate] = useState<boolean>(false);

  const onSubmit = async (values: RDebtsAndReceivables) => {

  };

  const onDelete = async () => {

  };

  const load = () => {

  };

  useEffect(() => {
    load();
  }, [updated]);

  const Results = (
    <>
      {debtsAndReceivables?.length == 0 && (
        <EmptyState
          title="Data hutang & piutang kosong"
          description="Rencanakan anggaran hutang & piutang anda di hutang & piutang tertentu"
          button={
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => {
                  toggleActive(true);
                  setEditData(undefined);
                }}
              >
                <PlusIcon className="h-5" /> Tambah Hutang & Piutang
              </Button>
            </div>
          }
        />
      )}
      {debtsAndReceivables?.map((month, index) => (
        <CardList
          key={index}
          title=""
          icon={<CalendarIcon className="w-6" />}
          details={[
          ]}
          onClick={async () => {
          }}
        />
      ))}
    </>
  );

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-500">Daftar hutang & piutang</h2>
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
        title={
          editData ? (
            <div className="flex justify-between">
              <p>Ubah hutang & piutang</p>
              <Link
                className="cursor-pointer underline text-blue-600"
                as="p"
                href={`/budgets?month_id=${editData?.id}`}
              >
                Lihat anggaran hutang & piutang ini
              </Link>
            </div>
          ) : (
            "Tambah Hutang & Piutang"
          )
        }
      >
        <></>
      </Modal>
    </>
  );
};

const DebtsAndReceivables = (props: IDebtsAndReceivables) => {
  return (
    <Layout noBottomNav>
      <List {...props} />
    </Layout>
  );
};

export default DebtsAndReceivables;

