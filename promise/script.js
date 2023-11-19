// async / await: thường dùng để handle hành động bất đồng bộ
// Trường hợp sử dụng ví dụ:
// getBlogId, getCommentsById

// promise: Thường dùng để thực hiện đồng thời các hoạt động bất đồng bộ
// Trường hợp sử dụng
// getTopListComment, getTopListBlog

const test1 = new Promise((resolve, reject) => {
	setTimeout(resolve, 1000, 'PromiseResolver 01');
});

const test2 = new Promise((resolve, reject) => {
	setTimeout(reject, 800, 'PromiseReject 02');
});

const test3 = new Promise((resolve, reject) => {
	setTimeout(resolve, 1000, 'PromiseResolver 03');
});

//! Case 1: ALL
// (nếu thành công hết thì trả về 1 mảng tất cả giá trị thành công)
// (nếu có bất kỳ lỗi nào trong mảng promise thì trả về giá trị thất bại không quan tâm bao nhiu thành công)
// Promise.all([test1, test2])
// 	.then((value) => console.log(`«««« 🔥 Result promise.all ${value} »»»»`))
// 	.catch((error) =>
// 		console.log('<<== 🚀 Result promise.all error ==>>', error)
// 	);

// Promise.all([test1, test3])
// 	.then((value) => console.log(`«««« 🔥 Result promise.all ${value} »»»»`))
// 	.catch((error) =>
// 		console.log('<<== 🚀 Result promise.all error ==>>', error)
// 	);

//! Case 2: ANY
// (nếu có bất kỳ thằng nào thành công kỳ trả về ngay ko quan tâm thằng nào bị lỗi hay thành công sau nữa)
// (nếu thất bại hết thì nó sẽ tổng hợp 1 file cath lỗi và hiển thị không có ai thành công)
// Promise.any([test2, test2])
// 	.then((value) => console.log(`«««« 🔥 Result promise.any ${value} »»»»`))
// 	.catch((error) =>
// 		console.log('<<== 🚀 Result promise.any error ==>>', error)
// 	);

//! Case 3: Race
// (Thằng nào nhanh thì nhất thì sẽ lấy ra, không quan tâm là thành công hay là thất bại)
Promise.race([test2, test3, test1])
	.then((value) => console.log(`«««« 🔥 Result promise.race ${value} »»»»`))
	.catch((error) =>
		console.log('<<== 🚀 Result promise.race error ==>>', error)
	);

//! Case 4: AllSettled
// (Nó là tổng hợp của tất cả cái ở trên)
Promise.allSettled([test2, test3, test1])
	.then((value) => {
		value.forEach((element) => {
			console.log(
				`«««« 🔥 Result promise.allsettled ${JSON.stringify(
					element
				)} »»»»`
			);
		});
	})
	.catch((error) =>
		console.log('<<== 🚀 Result promise.allsettled error ==>>', error)
	);
