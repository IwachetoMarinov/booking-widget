import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { setSelectedSlot } from "@/src/store/slices/availabilitySlice";

const Slots = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { availabilities, selectedSlot } = useAppSelector(
    (state) => state.availability
  );

  return (
    <section className="my-6">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">
        Available Slots
      </h2>

      {availabilities && availabilities.length > 0 ? (
        <div>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availabilities.map((time) => (
              <li key={time}>
                <button
                  type="button"
                  onClick={() => dispatch(setSelectedSlot(time))}
                  className={`
                    w-full rounded-lg px-2.5 py-1.5 text-xs font-medium
                    text-white
                    bg-gradient-to-r from-sky-300 to-emerald-500
                    hover:from-sky-400 hover:to-emerald-500
                    active:scale-95
                    transition-all duration-150
                    shadow-sm hover:shadow cursor-pointer
                    ${
                      selectedSlot === time
                        ? "ring-2 ring-emerald-400 from-emerald-700 to-sky-700 shadow-md scale-[0.98]"
                        : ""
                    }
                  `}
                >
                  {time}
                </button>
              </li>
            ))}
          </ul>

          {selectedSlot && (
            <div>
              <p className="mt-4 text-sm text-slate-600">
                Selected Slot: <strong>{selectedSlot}</strong>
              </p>

              {/* Create booking button */}
              <button
                type="button"
                onClick={() => router.push("/customer")}
                className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:scale-95 transition-all duration-150 shadow cursor-pointer"
              >
                Proceed to Book
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No available slots for the selected date.
        </p>
      )}
    </section>
  );
};

export default Slots;
