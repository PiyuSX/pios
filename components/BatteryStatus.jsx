"use client";

import { useEffect, useState } from "react";

export default function BatteryStatus() {
  const [battery, setBattery] = useState(null);

  useEffect(() => {
    let manager;
    let mounted = true;

    const update = () => {
      if (!mounted || !manager) return;
      setBattery({
        level: Math.round(manager.level * 100),
        charging: manager.charging,
      });
    };

    (async () => {
      try {
        if (!navigator.getBattery) return;
        manager = await navigator.getBattery();
        update();
        manager.addEventListener("levelchange", update);
        manager.addEventListener("chargingchange", update);
      } catch {}
    })();

    return () => {
      mounted = false;
      if (manager) {
        manager.removeEventListener("levelchange", update);
        manager.removeEventListener("chargingchange", update);
      }
    };
  }, []);

  if (!battery) return null;

  const { level, charging } = battery;
  const fillWidth = 19 * (level / 100);

  const fillColor = charging
    ? "#30D158"
    : level <= 20
      ? "#FF3B30"
      : "currentColor";

  return (
    <div className="p-1 text-foreground">
      <svg
        width="27"
        height="13"
        viewBox="0 0 27 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="22"
          height="12"
          rx="3.8"
          stroke="currentColor"
          strokeOpacity="0.4"
        />
        <path
          d="M24 4.4V8.6C24.9 8.25 25.5 7.45 25.5 6.5C25.5 5.55 24.9 4.75 24 4.4Z"
          fill="currentColor"
          fillOpacity="0.45"
        />
        <rect
          x="2"
          y="2"
          width={fillWidth}
          height="9"
          rx={Math.min(2.5, fillWidth / 2)}
          fill={fillColor}
        />
        {charging && (
          <path
            d="M12.6 2.8L7.6 7.2H10.6L9.8 10.8L15 6.2H12L12.6 2.8Z"
            fill="currentColor"
            stroke="var(--background)"
            strokeWidth="1"
            strokeLinejoin="round"
            paintOrder="stroke"
          />
        )}
      </svg>
    </div>
  );
}


