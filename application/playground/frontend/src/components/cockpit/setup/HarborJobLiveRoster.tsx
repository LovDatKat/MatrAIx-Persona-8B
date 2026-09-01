import { useMemo } from "react";

import type { HarborJobDetail } from "@/lib/types";
import { useHarborBatchStatus } from "@/lib/useHarborBatchStatus";

import { BatchTrialGrid, buildBatchCellsFromStatus, buildBatchGridCells } from "./BatchTrialGrid";
import { BatchTrialStage } from "./BatchTrialStage";

function agentsFromConfig(
  config: HarborJobDetail["config"],
): Array<Record<string, unknown>> {
  const agents = config && typeof config === "object" ? config.agents : null;
  if (!Array.isArray(agents)) return [];
  return agents.filter(
    (row): row is Record<string, unknown> =>
      Boolean(row) && typeof row === "object" && !Array.isArray(row),
  );
}

function personaIdsFromConfig(config: HarborJobDetail["config"]): string[] {
  return agentsFromConfig(config).map((agent, index) => {
    const kwargs =
      agent.kwargs && typeof agent.kwargs === "object" && !Array.isArray(agent.kwargs)
        ? (agent.kwargs as { persona_path?: unknown })
        : null;
    const path = typeof kwargs?.persona_path === "string" ? kwargs.persona_path : "";
    const stem = path.split("/").pop() ?? "";
    if (stem.startsWith("persona_")) return stem.slice("persona_".length);
    return stem || `agent-${index}`;
  });
}

export function HarborJobLiveRoster({
  jobName,
  config,
  onOpenTrial,
}: {
  jobName: string;
  config?: HarborJobDetail["config"];
  onOpenTrial?: (trialName: string) => void;
}) {
  const personaIds = useMemo(() => personaIdsFromConfig(config), [config]);
  const expectedFromConfig = agentsFromConfig(config).length;
  const status = useHarborBatchStatus(jobName, true);
  const expectedTotal = Math.max(
    expectedFromConfig,
    personaIds.length,
    status.snapshot?.trialCount ?? 0,
  );

  const cells = useMemo(() => {
    if (status.snapshot) {
      return buildBatchCellsFromStatus(status.snapshot, {
        expectedTotal,
        personaIds,
      });
    }
    return buildBatchGridCells(personaIds, undefined, {
      jobStarted: true,
      expectedTotal,
    });
  }, [status.snapshot, expectedTotal, personaIds]);

  return (
    <BatchTrialStage>
      <BatchTrialGrid
        trials={cells}
        jobLabel={jobName}
        onSelectTrial={onOpenTrial}
      />
    </BatchTrialStage>
  );
}
