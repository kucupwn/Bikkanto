import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 1rem;
  background: var(--board);
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
`;

const Bar = styled.div<{ $w: number }>`
  height: 28px;
  width: ${({ $w }) => $w}%;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    var(--board-cell) 0%,
    var(--board-cell-hi) 50%,
    var(--board-cell) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s linear infinite;
`;

export function Loader({ rows = 6 }: { rows?: number }) {
  const widths = [100, 92, 96, 88, 100, 94, 90, 98];

  return (
    <Rows role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Bar key={i} $w={widths[i % widths.length]} />
      ))}
    </Rows>
  );
}
