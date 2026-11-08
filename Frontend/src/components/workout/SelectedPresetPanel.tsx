import styled from "styled-components";
import { Bookmark } from "lucide-react";
import type { Preset } from "../../types/presetTypes";
import { Panel, SectionTitle } from "../ui";

const NameRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  svg {
    flex: none;
    margin-top: 4px;
    color: var(--amber);
  }
`;

const PresetName = styled.p`
  min-width: 0;
  font-family: var(--font-board);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.15;
  text-transform: uppercase;
  color: var(--ink);
  overflow-wrap: anywhere;
`;

const Count = styled.p`
  margin-top: 0.25rem;
  font-family: var(--font-board);
  font-size: 14px;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--ink-2);
`;

const Hint = styled.p`
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-2);
  font-size: 14px;
`;

interface Props {
  preset: Preset;
}

export function SelectedPresetPanel({ preset }: Props) {
  const count = preset.exercises.length;

  return (
    <Panel aria-labelledby="selected-preset-title">
      <SectionTitle id="selected-preset-title">Selected preset</SectionTitle>
      <NameRow>
        <Bookmark size={22} aria-hidden="true" />
        <div>
          <PresetName>{preset.preset_name}</PresetName>
          <Count>
            {count} {count === 1 ? "exercise" : "exercises"}
          </Count>
        </div>
      </NameRow>
      <Hint>
        Rep changes apply to this workout only. Your saved preset stays as it
        is.
      </Hint>
    </Panel>
  );
}
