// import { DateTime } from "luxon";
// import PlanningModel from "./planning.model";
// import BookModel from "../book/book.model";

// export const addReadPages = async (req, res) => {
//   const user = req.user;
//   const { pages } = req.body;
//   const planning = await PlanningModel.findOne({ _id: user?.planning });
//   if (!planning) {
//     return res.status(403).send({ message: "You must start a planning first" });
//   }
//   let book = null;
//   let diff = 0;
//   let currentIteration = 0;
//   for (let i = 0; i < planning.books.length; i++) {
//     currentIteration = i;
//     book = await BookModel.findOne({ _id: planning.books[i] });
//     if (book?.pagesTotal === book?.pagesFinished) {
//       continue;
//     }
//     book.pagesFinished += pages;
//     if (book.pagesFinished > book.pagesTotal) {
//       diff = book.pagesFinished - book.pagesTotal;
//       book.pagesFinished = book.pagesTotal;
//       while (diff !== 0) {
//         currentIteration++;
//         const nextBook = await BookModel.findOne({
//           _id: planning.books[currentIteration],
//         });
//         nextBook.pagesFinished += diff;
//         if (nextBook.pagesFinished > nextBook.pagesTotal) {
//           diff = nextBook.pagesFinished - nextBook.pagesTotal;
//           nextBook.pagesFinished = nextBook.pagesTotal;
//           await nextBook.save();
//         } else {
//           diff = 0;
//         }
//       }
//     }
//     await book.save();
//     break;
//   }
//   if (!book) {
//     return res.status(403).send({
//       message: "You have already read all the books from this planning",
//     });
//   }
//   const date = DateTime.now().setZone("Europe/Kiev").toObject();
//   let minute = date.minute?.toString();
//   if (date.minute.toString().length === 1) {
//     minute = "0" + date.minute;
//   }
//   const time = `${date.year}-${date.month}-${date.day} ${date.hour}:${minute}`;
//   planning.stats.push({ time, pagesCount: pages });
//   await planning.save();
//   return res.status(200).send({ book, planning });
// };

// export const getPlanning = async (req, res, next) => {
//   const user = req.user;
//   return PlanningModel.findOne({
//     _id: user?.planning,
//   })
//     .populate("books")
//     .exec(async (err, data) => {
//       if (err) {
//         next(err);
//       }
//       if (!data) {
//         return res
//           .status(403)
//           .send({ message: "You should start planning first" });
//       }
//       const time = DateTime.now()
//         .setZone("Europe/Kiev")
//         .toFormat("yyyy-MM-dd")
//         .split("-");
//       const endDateObj = data.endDate.split("-");
//       const dateNow = DateTime.local(
//         Number(time[0]),
//         Number(time[1]),
//         Number(time[2])
//       );
//       const endDate = DateTime.local(
//         Number(endDateObj[0]),
//         Number(endDateObj[1]),
//         Number(endDateObj[2])
//       );
//       const diff = endDate.diff(dateNow, "days").toObject().days;
//       //   const results = [];
//       if (
//         data.books.every((item) => item.pagesTotal === item.pagesFinished) ||
//         !diff ||
//         diff < 1
//       ) {
//         await PlanningModel.deleteOne({ _id: req.user.planning });
//         req.user.planning = null;
//         await req.user.save();
//         return res
//           .status(403)
//           .send({ message: "Your planning has already ended" });
//       }
//       return res.status(200).send({ planning: data });
//     });
// };
