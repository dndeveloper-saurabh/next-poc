import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Lottie from "lottie-react-web";
import {circularProgress} from "../../public/assets";

export default function InfiniteScroll({children, className, noMoreText, loadingText, noMore, fetchMoreFn = function() {}, targetedRef, initialized, textStyle}) {
	const observer = useRef(null);
	const scrollRef = useRef(null);
	const [fetchMore, setFetchMore] = useState(false);
	const [changed, setChanged] = useState(0);

	const bottomRef = useCallback((node) => {
		if(!node) return;
		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver((entries) => {
			if(entries[0].isIntersecting) setFetchMore(true);
			else setFetchMore(false);
		})
		observer.current.observe(node);

	}, []);

	useEffect(() => {
		if(!scrollRef.current) return () => null;
		// Options for the observer (which mutations to observe)
		const resizeObserver = new ResizeObserver(entries => {
			setChanged(c => c+1);
		});

		resizeObserver.observe(scrollRef.current);

		return () => resizeObserver.disconnect();
	}, [scrollRef.current]);

	const isOverflowing = useMemo(() => {
		if(!scrollRef.current) return false;
		return scrollRef.current.scrollHeight >= scrollRef.current.clientHeight;
	}, [scrollRef.current, scrollRef.current?.scrollHeight, changed]);


	useEffect(() => {
		if(!fetchMore || !observer.current || noMore) return () => {};
		setFetchMore(false);
		fetchMoreFn();
	}, [fetchMore, noMore, observer.current]);

	useEffect(() => {
		if(!targetedRef?.current) return () => {};
		setTimeout(() => {
			targetedRef.current.scrollIntoView();
		}, 0);
	}, [targetedRef?.current]);

	return (
		<div ref={scrollRef} className={className}>
			{children}
			{initialized && isOverflowing && <div ref={noMore ? null : bottomRef} style={{
				padding: '20px',
				textAlign: 'center',
				color: '#aaa',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: '1.35em'
			}}>
				{!noMore && <Lottie
          style={{width: '20px', height: '20px', margin: '0 1em 0 0'}} options={{animationData: circularProgress, loop: true}}
        />}
        <span style={textStyle}>{noMore ? (noMoreText ?? 'No more sessions') : (loadingText ?? 'Loading more sessions...')}</span>
      </div>}
		</div>
	)
}
