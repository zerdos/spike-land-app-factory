// voronoi.tsx

import { useMemo, useState, useCallback, useRef } from "react";

import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { GradientPinkRed } from "@visx/gradient";
import { scaleLinear } from "@visx/scale";
import genRandomNormalPoints, { PointsRange } from "@visx/mock-data/lib/generators/genRandomNormalPoints";
import { withTooltip, Tooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { voronoi, VoronoiPolygon } from "@visx/voronoi";
import { localPoint } from "@visx/event";

const points: PointsRange[] = genRandomNormalPoints(600, /* seed= */ 0.5).filter((_, i) => i < 160);

const x = (d: PointsRange) => d[0];
const y = (d: PointsRange) => d[1];

export type DotsProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

let tooltipTimeout: number;

export default withTooltip<DotsProps, PointsRange>(
  // @ts-ignore
  ({ width, height, showControls = true, hideTooltip, showTooltip, tooltipOpen, tooltipData, tooltipLeft, tooltipTop }: DotsProps & WithTooltipProvidedProps<PointsRange>) => {
    if (width < 10) return null;
    // Add Tailwind CSS classes to the component wrapper
    const containerClasses = "p-4 bg-gray-100 rounded-lg";
    const [showVoronoi, setShowVoronoi] = useState(showControls);
    const svgRef = useRef<SVGSVGElement>(null);
    const xScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [1.3, 2.2],
          range: [0, width],
          clamp: true,
        }),
      [width]
    );
    const yScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [0.75, 1.6],
          range: [height, 0],
          clamp: true,
        }),
      [height]
    );
    const voronoiLayout = useMemo(
      () =>
        voronoi<PointsRange>({
          x: (d) => xScale(x(d)) ?? 0,
          y: (d) => yScale(y(d)) ?? 0,
          width,
          height,
        })(points),
      [width, height, xScale, yScale]
    );

    // event handler
    const handleMouseMove = useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        if (!svgRef.current) return;
        // find the nearest polygon to the crent m
        const point = localPoint(svgRef.current, event);
        if (!point) return;
        const neighborRadius = 100;
        const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
        if (closest) {
          showTooltip({
            tooltipLeft: xScale(x(closest.data)),
            tooltipTop: yScale(y(closest.data)),
            tooltipData: closest.data,
          });
        }
      },
      [xScale, yScale, showTooltip, voronoiLayout]
    );

    const handleMouseLeave = useCallback(() => {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);
    }, [hideTooltip]);

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Voronoi Diagram</h1>
        <svg width={width} height={height} ref={svgRef}>
          {/* Gradient removed as it's no longer used */}
          {/** capture all mouse events with a
           
            */}
          <rect width={width} height={height} rx={14} fill="orange" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onTouchMove={handleMouseMove} onTouchEnd={handleMouseLeave} />
          <Group pointerEvents="none">
            {points.map((point, i) => (
              <Circle key={`point-${point[0]}-${i}`} className="dot" cx={xScale(x(point))} cy={yScale(y(point))} r={i % 3 === 0 ? 2 : 3} fill={tooltipData === point ? "white" : "#1e3a8a"} />
            ))}
            {showVoronoi && voronoiLayout.polygons().map((polygon, i) => <VoronoiPolygon key={`polygon-${i}`} polygon={polygon} fill="white" stroke="white" strokeWidth={1} strokeOpacity={0.2} fillOpacity={tooltipData === polygon.data ? 0.5 : 0} />)}
          </Group>
        </svg>
        {tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
          <Tooltip left={tooltipLeft + 10} top={tooltipTop + 10}>
            <div>
              <strong>x:</strong> {x(tooltipData)}
            </div>
            <div>
              <strong>y:</strong> {y(tooltipData)}
            </div>
          </Tooltip>
        )}
        {showControls && (
          <div>
            <label style={{ fontSize: 12 }}>
              <input type="checkbox" checked={showVoronoi} onChange={() => setShowVoronoi(!showVoronoi)} />
              &nbsp;Show voronoi point maskskskskjdqqjdjjdjjd
            </label>
          </div>
        )}
      </div>
    );
  }
);
