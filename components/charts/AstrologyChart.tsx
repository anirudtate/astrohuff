import { useEffect, useRef, useState } from 'react';

interface PlanetData {
	fullDegree: number;
	normDegree: number;
	isRetro: string;
	current_sign: number;
	speed?: number;
	nakshatra?: string;
	nakshatraLord?: string;
	nakshatraPada?: number;
	signLord?: string;
}

interface ChartProps {
	planets: Record<string, PlanetData>;
	type: 'birth' | 'navamsa';
}

interface TooltipData {
	title: string;
	content: string[];
	x: number;
	y: number;
}

const zodiacSigns = [
	"♈", "♉", "♊", "♋", "♌", "♍", 
	"♎", "♏", "♐", "♑", "♒", "♓"
];

const planetSymbols: Record<string, string> = {
	Sun: "☉",
	Moon: "☽",
	Mars: "♂",
	Mercury: "☿",
	Jupiter: "♃",
	Venus: "♀",
	Saturn: "♄",
	Rahu: "☊",
	Ketu: "☋",
};

const planetColors: Record<string, string> = {
	Sun: "#FFA500",
	Moon: "#FFFFFF",
	Mars: "#FF4444",
	Mercury: "#00FF00",
	Jupiter: "#FFFF00",
	Venus: "#FFC0CB",
	Saturn: "#4444FF",
	Rahu: "#800080",
	Ketu: "#800080",
};

export function AstrologyChart({ planets, type }: ChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [tooltip, setTooltip] = useState<TooltipData | null>(null);

	useEffect(() => {
		if (!svgRef.current) return;

		const svg = svgRef.current;
		const size = 400;
		const boxSize = size / 3;

		// Store event listeners for cleanup
		const listeners: { element: Element; type: string; handler: (e: Event) => void }[] = [];

		const addListener = (element: Element, type: string, handler: (e: Event) => void) => {
			element.addEventListener(type, handler);
			listeners.push({ element, type, handler });
		};

		// Clear previous content
		while (svg.firstChild) {
			svg.removeChild(svg.firstChild);
		}

		// Draw outer square

		const outerSquare = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		outerSquare.setAttribute("width", size.toString());
		outerSquare.setAttribute("height", size.toString());
		outerSquare.setAttribute("fill", "none");
		outerSquare.setAttribute("stroke", "#444");
		outerSquare.setAttribute("stroke-width", "3");
		svg.appendChild(outerSquare);

		// Draw inner grid with improved visibility
		const gridLines = [
			{ x1: 0, y1: boxSize, x2: size, y2: boxSize },
			{ x1: 0, y1: 2 * boxSize, x2: size, y2: 2 * boxSize },
			{ x1: boxSize, y1: 0, x2: boxSize, y2: size },
			{ x1: 2 * boxSize, y1: 0, x2: 2 * boxSize, y2: size },
		];

		gridLines.forEach(({ x1, y1, x2, y2 }) => {
			const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", x1.toString());
			line.setAttribute("y1", y1.toString());
			line.setAttribute("x2", x2.toString());
			line.setAttribute("y2", y2.toString());
			line.setAttribute("stroke", "#444");
			line.setAttribute("stroke-width", "2");
			svg.appendChild(line);
		});


		// Draw diagonal lines with improved visibility
		const diagonalLines = [
			{ x1: 0, y1: 0, x2: size, y2: size },
			{ x1: size, y1: 0, x2: 0, y2: size }
		];

		diagonalLines.forEach(({ x1, y1, x2, y2 }) => {
			const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", x1.toString());
			line.setAttribute("y1", y1.toString());
			line.setAttribute("x2", x2.toString());
			line.setAttribute("y2", y2.toString());
			line.setAttribute("stroke", "#444");
			line.setAttribute("stroke-width", "2");
			svg.appendChild(line);
		});


		// Add house numbers and signs
		const positions = [
			[1, 0, 0], [2, 1, 0], [3, 2, 0],
			[4, 2, 1], [5, 2, 2], [6, 1, 2],
			[7, 0, 2], [8, 0, 1], [9, 0, 0],
			[10, 1, 0], [11, 2, 0], [12, 2, 1]
		];

		positions.forEach(([house, row, col]) => {
			const x = col * boxSize + boxSize / 2;
			const y = row * boxSize + 30; // Adjust vertical position

			// House number
			const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			text.setAttribute("x", x.toString());
			text.setAttribute("y", y.toString());
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("font-size", "18");
			text.setAttribute("font-weight", "bold");
			text.setAttribute("fill", "#fff");
			text.textContent = house.toString();
			svg.appendChild(text);

			// Zodiac sign
			const sign = document.createElementNS("http://www.w3.org/2000/svg", "text");
			sign.setAttribute("x", x.toString());
			sign.setAttribute("y", (y + 35).toString()); // More space between number and sign
			sign.setAttribute("text-anchor", "middle");
			sign.setAttribute("font-size", "24");
			sign.setAttribute("fill", "#666");
			sign.textContent = zodiacSigns[(house - 1 + (type === 'navamsa' ? 0 : 0)) % 12];
			svg.appendChild(sign);
		});

		// Track planet positions
		const planetPositions = new Map<number, number>(); // house -> count of planets

		// Place planets
		Object.entries(planets).forEach(([name, data]) => {
			if (name === "debug" || name === "13") return;

			const house = type === 'navamsa' 
				? Math.floor((data.fullDegree % 30) / 3.333333) + 1
				: Math.floor(data.fullDegree / 30) + 1;

			const position = positions.find(([h]) => h === house);
			if (!position) return;

			const [, row, col] = position;
			const baseX = col * boxSize + boxSize / 2;
			const baseY = row * boxSize + boxSize / 2;

			// Get count of planets in this house and update
			const count = planetPositions.get(house) || 0;
			planetPositions.set(house, count + 1);

			// Calculate position with improved spacing
			const planetsInHouse = count + 1;
			const maxPlanetsPerRow = 3;
			const spacing = Math.min(30, boxSize / (maxPlanetsPerRow + 1));
			const rowSpacing = Math.min(35, boxSize / 4); // Adjust vertical spacing
			const rowIndex = Math.floor(count / maxPlanetsPerRow);
			const colIndex = count % maxPlanetsPerRow;
			const planetsInCurrentRow = Math.min(maxPlanetsPerRow, planetsInHouse - rowIndex * maxPlanetsPerRow);
			const rowWidth = planetsInCurrentRow * spacing;
			const startX = baseX - rowWidth / 2 + spacing / 2;
			const x = startX + colIndex * spacing;
			const y = baseY + rowIndex * rowSpacing - (rowIndex > 0 ? rowSpacing / 2 : 0);

			// Update circle and symbol rendering
			const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			circle.setAttribute("cx", x.toString());
			circle.setAttribute("cy", y.toString());
			circle.setAttribute("r", "12");
			circle.setAttribute("fill", "#1a1a1a");
			circle.setAttribute("stroke", planetColors[name] || "#444");
			circle.setAttribute("stroke-width", "2");
			svg.appendChild(circle);

			const symbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
			symbol.setAttribute("x", x.toString());
			symbol.setAttribute("y", y.toString());
			symbol.setAttribute("text-anchor", "middle");
			symbol.setAttribute("dominant-baseline", "middle");
			symbol.setAttribute("font-size", "16");
			symbol.setAttribute("fill", planetColors[name] || "#fff");
			symbol.textContent = planetSymbols[name] || name;

			const handleMouseOver = () => {
				if (!containerRef.current) return;
				const rect = containerRef.current.getBoundingClientRect();
				const svgRect = svg.getBoundingClientRect();
				const scale = svgRect.width / size;
				
				// Convert SVG coordinates to screen coordinates
				const screenX = (x * scale) + svgRect.left;
				const screenY = (y * scale) + svgRect.top - 20; // Offset tooltip higher
				
				setTooltip({
					title: name,
					content: [
						`Sign: ${zodiacSigns[data.current_sign - 1]}`,
						`Degree: ${data.normDegree.toFixed(2)}°`,
						`Full Degree: ${data.fullDegree.toFixed(2)}°`,
						data.nakshatra ? `Nakshatra: ${data.nakshatra}` : '',
						data.nakshatraLord ? `Lord: ${data.nakshatraLord}` : '',
						data.nakshatraPada ? `Pada: ${data.nakshatraPada}` : '',
						data.signLord ? `Sign Lord: ${data.signLord}` : '',
						data.speed ? `Speed: ${data.speed.toFixed(4)}` : '',
						data.isRetro === "true" ? "Retrograde" : "Direct"
					].filter(Boolean),
					x: screenX - rect.left,
					y: screenY - rect.top
				});
			};


			const handleMouseOut = () => setTooltip(null);

			addListener(symbol, 'mouseover', handleMouseOver);
			addListener(symbol, 'mouseout', handleMouseOut);


			svg.appendChild(symbol);

			// Retrograde symbol
			if (data.isRetro === "true") {
				const retro = document.createElementNS("http://www.w3.org/2000/svg", "text");
				retro.setAttribute("x", x.toString());
				retro.setAttribute("y", (y + 18).toString());
				retro.setAttribute("text-anchor", "middle");
				retro.setAttribute("font-size", "12");
				retro.setAttribute("fill", "#ff4444");
				retro.setAttribute("font-weight", "bold");
				retro.textContent = "℞";
				svg.appendChild(retro);
			}
		});

	// Cleanup function
	return () => {
		listeners.forEach(({ element, type, handler }) => {
			element.removeEventListener(type, handler);
		});
	};
}, [planets, type]);

return (
	<div ref={containerRef} className="relative">
		<svg
			ref={svgRef}
			viewBox={`0 0 ${400} ${400}`}
			className="w-full aspect-square bg-[#1a1a1a] rounded-lg"
		/>
		{tooltip && (
			<div
				className="absolute z-10 px-4 py-2 bg-black/90 text-white rounded-lg shadow-lg"
				style={{
					left: `${tooltip.x}px`,
					top: `${tooltip.y}px`,
					transform: 'translate(-50%, -120%)',
					pointerEvents: 'none',
					minWidth: '200px',
					maxWidth: '300px',
					wordBreak: 'break-word',
					whiteSpace: 'normal',
					border: '1px solid #444',
					backgroundColor: 'rgba(0, 0, 0, 0.95)',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
					padding: '0.75rem 1rem'
				}}
			>
				<div className="font-semibold mb-2">{tooltip.title}</div>
				<div className="space-y-1">
					{tooltip.content.map((line, i) => (
						<div key={i} className="text-sm whitespace-normal leading-relaxed">{line}</div>
					))}
				</div>
			</div>
		)}
	</div>
	);
}
