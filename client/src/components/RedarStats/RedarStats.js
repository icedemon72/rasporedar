import clsx from 'clsx';
import { BatteryCharging, Eye, Focus, Gem } from 'lucide-react';
import React from 'react';

const RedarStats = ({ stats = [1, 1, 1, 1] }) => {
	const filledArray = new Array(5).fill(0);
	const colors = [
		'bg-red-500 dark:bg-red-600', 
		'bg-orange-500 dark:bg-orange-600',
		'bg-yellow-500 dark:bg-yellow-600',
		'bg-green-400 dark:bg-green-500',
		'bg-green-500 dark:bg-green-600'
	];

	const icons = [
		<BatteryCharging  data-tooltip-id="my-tooltip" data-tooltip-content="Pogodnost za bateriju" />,
		<Eye data-tooltip-id="my-tooltip" data-tooltip-content="Pogodnost za oči" />,
		<Focus data-tooltip-id="my-tooltip" data-tooltip-content="Efekat fokusiranja" />,
		<Gem data-tooltip-id="my-tooltip" data-tooltip-content="Osećaj elegancije" />
	];

	return (
		<div className="">
			<div className="grid grid-cols-2 md:grid-cols-2 w-full">
				{
					icons.map((Icon, i) => 
						<div className="full mb-2">
							<div className="my-1">
								{ Icon }
							</div>
							<div className="flex gap-1">
								{ 
									filledArray.map((_, index) => 
										<div className={clsx('border-2 p-2 border-black', 
											index < stats[i] ? colors[index] : 'bg-primary')}></div>
									)
								}
							</div>
						</div>
					)
				}
			</div>
		</div>
	)
}

export default RedarStats;