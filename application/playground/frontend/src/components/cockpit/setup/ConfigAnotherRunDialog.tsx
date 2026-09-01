import { useEffect } from "react";
import { createPortal } from "react-dom";

import { useI18n } from "@/i18n/I18nProvider";
import { FOCUS_RING } from "../cockpitShared";

export function ConfigAnotherRunDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-surface-dim/70 backdrop-blur-sm"
        aria-label={t("cockpitSetup.run.configAnotherCancel")}
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="config-another-run-title"
        className="glass-panel-strong relative z-10 w-full max-w-md rounded-xl shadow-2xl"
      >
        <div className="border-b border-outline/35 px-5 py-4">
          <h2
            id="config-another-run-title"
            className="font-display text-[16px] font-semibold text-text-main"
          >
            {t("cockpitSetup.run.configAnother")}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-text-variant">
            {t("cockpitSetup.run.configAnotherBody")}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className={`inline-flex items-center rounded-lg border border-outline/55 px-3.5 py-2 text-[13px] font-medium text-text-dim transition hover:border-outline hover:bg-surface-low hover:text-text-main ${FOCUS_RING}`}
          >
            {t("cockpitSetup.run.configAnotherCancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 font-display text-[13px] font-semibold text-on-primary transition hover:bg-primary-dim ${FOCUS_RING}`}
          >
            {t("cockpitSetup.run.configAnotherConfirm")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
