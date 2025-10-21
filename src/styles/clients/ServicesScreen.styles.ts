import { StyleSheet } from "react-native";
import { client, colors } from "../../theme/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary
  },
  // Section container card
  cardSection: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  sectionEmoji: {
    fontSize: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text.primary
  },
  // Favorite techs
  favoriteCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    marginTop: 8
  },
  favoriteLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: client.light,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    fontSize: 20
  },
  techName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary
  },
  techSpecialty: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4
  },
  stars: {
    fontSize: 12
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary
  },
  jobsText: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2
  },
  primaryPill: {
    backgroundColor: client.dark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999
  },
  primaryPillText: {
    color: "#fff",
    fontWeight: "800"
  },
  // History list
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 8
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 2
  },
  historyCode: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8
  },
  historyMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800"
  },
  datePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border
  },
  dateText: {
    fontSize: 12,
    color: colors.text.secondary
  },
  eyeIcon: {
    fontSize: 18,
    color: colors.text.tertiary
  },
  // Frequent services
  frequentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginTop: 8
  },
  frequentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1
  },
  frequentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  frequentIcon: {
    fontSize: 16
  },
  frequentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary
  },
  frequentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2
  },
  frequentMeta: {
    fontSize: 12,
    color: colors.text.secondary
  },
  secondaryPill: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: client.primary
  },
  secondaryPillText: {
    color: client.primary,
    fontWeight: "800"
  }
});
