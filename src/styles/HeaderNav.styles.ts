import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    paddingHorizontal: 16
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  profilePhoto: {
    marginRight: 12
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  locationContainer: {
    flex: 1,
    marginHorizontal: 12
  },
  locationText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "500"
  },
  notificationButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: "relative"
  },
  bellIcon: {
    fontSize: 24
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  notificationCount: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700"
  }
});
