import { useEffect } from "react";
import { getSocket } from "../services/socket";
import { useDeliveryStore } from "../stores/deliveryStore";
import { useNotificationStore } from "../stores/notificationStore";
import { useCheckinStore } from "../stores/checkinStore";

export function useSocket() {
  const updateDeliveryInList = useDeliveryStore((s) => s.updateDeliveryInList);
  const addDelivery = useDeliveryStore((s) => s.addDelivery);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addCheckin = useCheckinStore((s) => s.addCheckin);

  useEffect(() => {
    const socket = getSocket();

    socket.on("delivery:updated", (delivery) => {
      updateDeliveryInList(delivery);
    });

    socket.on("delivery:created", (delivery) => {
      addDelivery(delivery);
    });

    socket.on("delivery:statusChanged", ({ delivery }) => {
      updateDeliveryInList(delivery);
    });

    socket.on("notification:new", (notification) => {
      addNotification(notification);
    });

    socket.on("checkin:new", (checkin) => {
      addCheckin(checkin);
    });

    return () => {
      socket.off("delivery:updated");
      socket.off("delivery:created");
      socket.off("delivery:statusChanged");
      socket.off("notification:new");
      socket.off("checkin:new");
    };
  }, [updateDeliveryInList, addDelivery, addNotification, addCheckin]);
}
