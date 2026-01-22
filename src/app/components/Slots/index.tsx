import React from "react";
import { useRouter } from "next/navigation";
import { SlotAvailability } from "@/src/app/types";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { setSelectedSlot } from "@/src/store/slices/availabilitySlice";

interface IProps {
  selectedSlotName: string;
}

const Slots = ({ selectedSlotName }: IProps) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { availabilities, selectedSlot } = useAppSelector(
    (state) => state.availability,
  );

  const getSlotDurationDisplay = (slot: SlotAvailability | null) => {
    if (!slot) return "";
    const start = new Date(slot.duration.start);
    const end = new Date(slot.duration.end);

    return `${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <section className="my-6">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">
        Available Slots
      </h2>

      {availabilities && availabilities.length > 0 ? (
        <div>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availabilities.map((item, index: number) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => dispatch(setSelectedSlot(item))}
                  className={`
                    w-full rounded-lg px-2.5 py-1.5 text-xs font-medium active:scale-95 transition-all duration-150 shadow-sm hover:shadow cursor-pointer
                    ${
                      selectedSlot === item
                        ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                        : "bg-black text-white border border-transparent hover:bg-gray-800"
                    }
                  `}
                >
                  {getSlotDurationDisplay(item)}
                </button>
              </li>
            ))}
          </ul>

          {selectedSlot && (
            <div>
              <p className="mt-4 text-sm text-slate-600">
                Selected Slot:{" "}
                <strong>{getSlotDurationDisplay(selectedSlot)}</strong>
              </p>

              {/* Create booking button */}
              <button
                type="button"
                onClick={() => router.push("/customer")}
                className="mt-3 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 active:scale-95 transition-all duration-150 shadow cursor-pointer"
              >
                Proceed to Book
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No available slots for the selected date. For store {selectedSlotName}
        </p>
      )}
    </section>
  );
};

export default Slots;
