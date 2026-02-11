export class ExportEngine {
	/**
	 * Generates an SVG string from the pixel data.
	 * Merges adjacent pixels of the same color in the same row to optimize size.
	 */
	static toSVG(width: number, height: number, data: string[]): string {
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const color = data[y * width + x];
				// Skip empty/background color (assuming #eee8d5 is transparent in export)
				if (color === '#eee8d5') continue;

				// Find length of consecutive pixels of the same color in this row
				let run = 1;
				while (x + run < width && data[y * width + (x + run)] === color) {
					run++;
				}

				svg += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${color}" />`;
				x += run - 1; // Skip the run
			}
		}

		svg += '</svg>';
		return svg;
	}

		/**
		 * Renders the pixel data to a data URL (PNG) using HTML5 Canvas.
		 */
		static async toPNG(width: number, height: number, data: string[], scale: number): Promise<string> {
			const canvas = document.createElement('canvas');
			const finalWidth = Math.max(1, Math.round(width * scale));
			const finalHeight = Math.max(1, Math.round(height * scale));
			
			canvas.width = finalWidth;
			canvas.height = finalHeight;
			const ctx = canvas.getContext('2d');
	
			if (!ctx) throw new Error('Could not get canvas context');
	
			// Disable smoothing for sharp pixels
			ctx.imageSmoothingEnabled = false;
	
			const cellScale = scale;
	
			data.forEach((color, i) => {
				if (color === '#eee8d5') return; // Skip empty
				
				const x = i % width;
				const y = Math.floor(i / width);
				
				ctx.fillStyle = color;
				// Use Math.floor/ceil to avoid sub-pixel gaps at odd scales
				ctx.fillRect(
					Math.floor(x * cellScale), 
					Math.floor(y * cellScale), 
					Math.ceil(cellScale), 
					Math.ceil(cellScale)
				);
			});
	
			return canvas.toDataURL('image/png');
		}}
