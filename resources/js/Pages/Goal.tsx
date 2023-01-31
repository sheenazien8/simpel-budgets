import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { PlusIcon } from "@heroicons/react/20/solid";
import CardList from "../Components/List";
import Modal from "../Components/Modal";
import { useGoalAction } from "../actions";
import { MGoal, RGoal } from "../models";
import {
  classNames,
  formatMoney,
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import { EmptyState } from "../Components/EmptyState";
import FormData from "./../Components/Goal/FormData";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Inertia } from "@inertiajs/inertia";

interface IGoal {}

const List = () => {
  const { get, create, update, destroy } = useGoalAction();
  const [goals, setGoals] = useState<MGoal[]>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [editData, setEditData] = useState<MGoal>();
  const [errors, setErrors] = useState<RGoal>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (values: RGoal) => {
    let progress: any;
    if (!editData?.id) {
      progress = create(values, setErrors);
    } else {
      progress = update(editData.id, values, setErrors);
    }
    toastProgress(
      progress,
      `${editData?.id ? "Perubahan" : "Pembuatan"} tujuan`,
      () => {
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
      },
    );
  };

  const onDelete = async () => {
    if (editData?.id != undefined) {
      toastProgress(destroy(editData?.id), "Menghapus tujuan", () => {
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
      });
    }
  };

  const onUpdateStatus = async () => {
    if (editData?.id != undefined) {
      /* toastProgress(
        update(
          editData?.id,
          {

          },
          setErrors,
        ),
        "Perubahan status tujuan",
        () => {
          toggleActive(false);
          setUpdated(!updated);
          setEditData(undefined);
        },
      ); */
    }
  };

  const load = () => {
    setLoading(true);
    get().then((goals) => {
      setGoals(goals.data.data);
      setLoading(false);
    });
    toggleActive(false);
  };

  useEffect(() => {
    load();
  }, [updated]);

  const Results = (
    <>
      {goals?.length == 0 && (
        <EmptyState
          title="Data tujuan kosong"
          description="Rencanakan anggaran tujuan anda di tujuan tertentu"
          button={
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              value="Tambah"
              onClick={() => {
                toggleActive(true);
                setEditData(undefined);
              }}
            >
              <PlusIcon className="h-5" /> Tambah Tujuan
            </button>
          }
        />
      )}
      {goals?.map((goal, index) => (
        <CardList
          bgColor={
            Number(goal.over_target_date) == 1
              ? "bg-red-600"
              : Number(goal.status) == 1
              ? "bg-green-600"
              : "bg-yellow-600"
          }
          key={index}
          title={goal.title}
          icon={
            Number(goal.over_target_date) == 1 ? (
              <XCircleIcon className="w-6" />
            ) : Number(goal.status) == 1 ? (
              <CheckCircleIcon className="w-6" />
            ) : (
              <ClockIcon className="w-6" />
            )
          }
          details={[
            goal.description ?? "-",
            <p className="italic">
              <span>{goal.start_date}</span> s/d{" "}
              <span
                className={classNames(
                  Number(goal.over_target_date) == 1 ? "text-red-600" : "",
                )}
              >
                {goal.target_date}
              </span>
            </p>,
          ]}
          onClick={async () => {
              Inertia.visit(`/goals/${goal.id}/details`);
          }}
        />
      ))}
    </>
  );

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-500"></h2>
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
          className="mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 h-[550px] overflow-x-scroll"
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
              <p>Ubah tujuan</p>
            </div>
          ) : (
            "Tambah Tujuan"
          )
        }
      >
        <FormData
          onSubmit={onSubmit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          errors={errors}
          initialValues={editData}
        />
      </Modal>
    </>
  );
};

const Goal = (props: IGoal) => {
  return (
    <Layout
      title="Tujuan"
      description="Catat tujuanmu di sini untuk memberikan semangat menabungmu"
    >
      <List {...props} />
    </Layout>
  );
};

export default Goal;
