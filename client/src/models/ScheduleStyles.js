export const scheduleCustomStyles = {
	default: {
		background: 'bg-white',
		titleBackground: 'bg-gray-300',
		rowStyle: 'odd:bg-gray-200 even:bg-white',
		colStyle: 'border-r border-y last:border-r-0 border-black',
		clockCol: 'border-y border-r border-black bg-gray-300'
	},
	ice: {
		background: 'bg-blue-100',
		titleBackground: 'bg-gradient-to-r from-[#71A6D1] to-blue-300',
		rowStyle: 'odd:bg-blue-50 even:bg-blue-100',
		colStyle: 'border-r border-y last:border-r-0 border-blue-300',
		clockCol: 'border-y border-r border-blue-300 bg-blue-200'
	},
	block: {
		// do me...
	},
	pmf: {
		background: 'font-bold bg-[#4472c4]',
		titleBackground: 'border-b-2 border-black bg-[#4472c4]',
		rowStyle: 'even:bg-[#d8d8d8] odd:bg-white',
		colStyle: 'border-r border-y last:border-r-0 border-[#4a4f59]',
		clockCol: 'bg-[#4472c4]',
	},
	raven: {
		background: 'bg-black text-white',
		titleBackground: 'bg-black text-white',
		rowStyle: 'bg-stone-900 text-white',
		colStyle: 'border-r border-y last:border-r-0 border-black',
		clockCol: 'bg-black'
	},
	anthea: {
		background: 'bg-[#c336c3] font-bold uppercase text-[#fdf5fe] text-white',
		titleBackground: 'bg-[#e16ee4] uppercase',
		colStyle: 'even:bg-[#fbeafd] odd:bg-[#f6d4fa]',
		clockCol: 'bg-[#e16ee4]',
	}
}

/*
ANTHEA
					50: "#fdf5fe",
					100: "#fbeafd",
					200: "#f6d4fa",
					300: "#f2b2f5",
					400: "#ea85ed",
					500: "#e16ee4",
					600: "#c336c3",
					700: "#a12a9f",
					800: "#842481",
					900: "#6d2269",
					950: "#470b44",

					50: "#eff5ff",
					100: "#dce8fd",
					200: "#c1d7fc",
					300: "#96bffa",
					400: "#649cf6",
					500: "#3f78f2",
					600: "#305ee7",
					700: "#2145d4",
					800: "#2139ac",
					900: "#213587",
					950: "#182253",

*/