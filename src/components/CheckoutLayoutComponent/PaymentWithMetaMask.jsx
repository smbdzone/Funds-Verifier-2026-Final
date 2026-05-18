// "use client";

// import {
//   useConnect,
//   useAccount,
//   useWriteContract,
//   useSendTransaction,
// } from "wagmi";
// import { injected } from "wagmi/connectors";
// import { useState } from "react";
// import { sepolia, bsc } from "viem/chains";
// import { toast, ToastContainer } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { parseEther } from "viem";

// export const PaymentWithMetaMask = ({ price }) => {
//   const { connectAsync } = useConnect();
//   const { address } = useAccount();
//   const { writeContractAsync } = useWriteContract();
//   const { sendTransactionAsync } = useSendTransaction();
//   const [started, setStarted] = useState(false);
//   const [errors, setErrors] = useState();
//   const [completed, setCompleted] = useState(false);
//   const router = useRouter();

//   const handlePayment = async () => {
//     try {
//       setErrors("");
//       setStarted(true);
//       if (!address) {
//         await connectAsync({ chainId: bsc.id, connector: injected() });
//       }

//       const transaction = await sendTransactionAsync({
//         to: "0x6D06C809a6602a68E929Bc1be1D929A0d3cbd781",
//         value: parseEther(price.toString()),
//       });
//       setCompleted(true);
//       router.push("/success");
//     } catch (err) {
//       console.error("MetaMask payment error:", err.message);
//       setStarted(false);
//       alert(err.message);
//       //   setErrors(err.message);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       {!completed && (
//         <button
//           disabled={started}
//           className="flex-grow  shrink-0 w-full mt-4 p-2 flex justify-center items-center text-white btn-gradient border-0 flex-grow focus:outline-none text-[15px] font-semibold rounded "
//           onClick={handlePayment}
//         >
//           {address ? (
//             <>{started ? "Confirming..." : "Connected"}</>
//           ) : (
//             <>{started ? "Confirming..." : "Pay Now"}</>
//           )}
//         </button>
//       )}
//       {completed && (
//         <p className="text-stone-800 mt-2 bg-green-200 rounded-md text-sm py-2 px-4">
//           Thank you for your payment.
//         </p>
//       )}
//       {errors && (
//         <p className="text-stone-800 mt-2 bg-red-200 rounded-md lg:text-sm text-xs py-2 px-4">
//           {errors}
//         </p>
//       )}
//     </>
//   );
// };
