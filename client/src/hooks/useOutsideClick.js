import { useEffect } from "react";

export const useOutsideClick = (ref, onClickOut, ignoredIds = []) => {
  useEffect(() => {
		const handleClickOutside = (event) => {
				if (ref.current && !ref.current.contains(event.target) && !ignoredIds.some((id) => true === checkParent(id, event.target))) {
					onClickOut();
				}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
				// Unbind the event listener on clean up
				document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ ref, onClickOut ])
};

const checkParent = (parent, child) => {
	let node = child.parentNode;

	// keep iterating unless null
	while (node != null) {
		if (node.id == parent) return true;

		node = node.parentNode;
	}

	return false;
}


export default useOutsideClick;	