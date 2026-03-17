"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { useTranslations } from "next-intl";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";

export default function CreateHomepagePushDialog({
  open,
  onClose,
  onSuccess,
  merchantId: merchantIdProp,
}) {
  const t = useTranslations("merchantHomepagePush.create");
  const { data: session } = useSession();

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
    const day = `${today.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForInput = (value) => {
    if (!value) return getTodayDateString();

    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, "0");
      const day = `${value.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    const normalized = String(value);
    let parsed;

    if (normalized.includes("T")) {
      const parsedDateTime = new Date(normalized);
      if (Number.isNaN(parsedDateTime.getTime())) return getTodayDateString();
      parsed = new Date(
        parsedDateTime.getFullYear(),
        parsedDateTime.getMonth(),
        parsedDateTime.getDate(),
      );
    } else {
      const [year, month, day] = normalized.split("-").map(Number);
      if (!year || !month || !day) {
        const fallback = new Date(normalized);
        if (Number.isNaN(fallback.getTime())) return getTodayDateString();
        parsed = new Date(
          fallback.getFullYear(),
          fallback.getMonth(),
          fallback.getDate(),
        );
      } else {
        parsed = new Date(year, month - 1, day);
      }
    }

    const year = parsed.getFullYear();
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsed.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatPlacementLabel = (placement) => {
    const normalized = String(placement || "top").toLowerCase();
    if (normalized === "top") return "Top";
    if (normalized === "bottom") return "Bottom";
    if (normalized === "left") return "Left";
    if (normalized === "right") return "Right";
    return normalized;
  };

  const [type, setType] = useState("coupon");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [couponBatches, setCouponBatches] = useState([]);
  const [slots, setSlots] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [adConfig, setAdConfig] = useState({
    placement: "top",
    startDate: getTodayDateString(),
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const merchantId = (() => {
    if (merchantIdProp || session?.user?.merchantId) {
      return merchantIdProp || session?.user?.merchantId;
    }

    if (typeof window === "undefined") {
      return null;
    }

    return (
      window.localStorage.getItem("merchantId") ||
      window.sessionStorage.getItem("merchantId")
    );
  })();

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, merchantId]);

  const getEffectiveStartDate = () =>
    type === "ad" ? adConfig.startDate : startDate;

  const getEndDate = () => {
    if (!pricing) return "";
    const effectiveStartDate = getEffectiveStartDate();
    if (!effectiveStartDate) return "";

    const duration =
      type === "coupon" ? pricing.couponDuration : pricing.adDuration;
    const start = new Date(effectiveStartDate);
    const end = new Date(start);
    end.setDate(end.getDate() + duration);

    const year = end.getFullYear();
    const month = `${end.getMonth() + 1}`.padStart(2, "0");
    const day = `${end.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const batchesResp = await axiosInstance.get("/coupon-batches", {
        params: { page: 1, pageSize: 200 },
      });
      const batchesPayload = batchesResp?.data?.data ?? batchesResp?.data ?? {};
      const batchesList = Array.isArray(batchesPayload)
        ? batchesPayload
        : batchesPayload?.batches || [];
      setCouponBatches(batchesList);

      const slotsResp = await axiosInstance.get("/approvals/available-homepage-slots");
      setSlots(slotsResp?.data || {});

      const settingsResp = await axiosInstance.get(
        "/super-admin-settings/homepage-placement-pricing",
      );
      const settings = settingsResp?.data?.data || settingsResp?.data || {};
      setPricing({
        coupon: settings?.homepage_coupon_placement_cost || 50,
        ad: settings?.homepage_ad_placement_cost || 100,
        couponDuration: settings?.coupon_homepage_placement_duration_days || 7,
        adDuration: settings?.ad_homepage_placement_duration_days || 7,
      });

      if (merchantId) {
        const merchantSettingsResp = await axiosInstance.get(
          `/merchant-settings/merchant/${merchantId}`,
        );
        const merchantSettingsPayload = merchantSettingsResp?.data || {};
        const merchantSettings =
          merchantSettingsPayload?.data?.data ||
          merchantSettingsPayload?.data ||
          merchantSettingsPayload ||
          {};

        setAdConfig({
          placement: merchantSettings?.superadmin_homepage_ad_placement || "top",
          startDate: formatDateForInput(
            merchantSettings?.superadmin_homepage_ad_start_date,
          ),
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(t("errors.failedToLoadData"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "coupon" && !selectedBatchId) {
      toast.error(t("errors.selectCoupon"));
      return;
    }

    setSubmitting(true);
    try {
      if (type === "coupon") {
        await axiosInstance.post("/approvals/homepage-coupon-push", {
          coupon_batch_id: parseInt(selectedBatchId),
          start_date: startDate,
        });
      } else {
        await axiosInstance.post("/approvals/homepage-ad-push", {});
      }

      toast.success(t("success.requestCreated"));
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || t("errors.failedToCreate");
      toast.error(errorMsg);
      console.error("Error creating request:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const availableSlots = type === "coupon"
    ? slots?.coupons?.available || 0
    : slots?.ads?.available || 0;

  const cost = type === "coupon" ? pricing?.coupon : pricing?.ad;
  const duration = type === "coupon" ? pricing?.couponDuration : pricing?.adDuration;

  const availableBatches = couponBatches.filter(
    (batch) => Boolean(batch?.id) && batch?.is_active !== false,
  );
  const hasAvailableBatches = availableBatches.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {type === "coupon"
                  ? t("info.availableCouponSlots", { count: availableSlots })
                  : t("info.availableAdSlots", { count: availableSlots })}
              </AlertDescription>
            </Alert>

            {availableSlots === 0 && (
              <Alert variant="destructive">
                <AlertDescription>{t("errors.noSlotsAvailable")}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>{t("fields.type.label")}</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coupon">{t("fields.type.options.coupon")}</SelectItem>
                  <SelectItem value="ad">{t("fields.type.options.ad")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === "coupon" && (
              <div className="space-y-2">
                <Label>{t("fields.coupon.label")}</Label>
                <Select
                  value={selectedBatchId}
                  onValueChange={setSelectedBatchId}
                  disabled={!hasAvailableBatches}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={hasAvailableBatches ? t("fields.coupon.placeholder") : "No coupon batches available"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {hasAvailableBatches ? (
                      availableBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.batch_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-coupons" disabled>
                        No coupon batches available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {type === "ad" && (
              <div className="space-y-2">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    For ad requests, media, placement, and start date are taken from Merchant Settings → Superadmin Homepage Ad Settings.
                  </AlertDescription>
                </Alert>
                <div className="space-y-1">
                  <Label>Placement</Label>
                  <Input
                    value={formatPlacementLabel(adConfig.placement)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            )}

            {type === "coupon" && (
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  min={getTodayDateString()}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Select your preferred start date for the campaign
                </p>
              </div>
            )}

            {getEffectiveStartDate() && pricing && (
              <div className="space-y-2">
                <Label>End Date (Calculated)</Label>
                <Input type="text" value={getEndDate()} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  Campaign will run for {type === "coupon" ? pricing.couponDuration : pricing.adDuration} days
                </p>
              </div>
            )}

            {pricing && (
              <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t("pricing.cost")}</span>
                  <span className="text-sm font-bold">${cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t("pricing.duration")}</span>
                  <span className="text-sm">{duration} {t("pricing.days")}</span>
                </div>
                {getEffectiveStartDate() && getEndDate() && (
                  <div className="pt-2 mt-2 border-t">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Campaign period:</div>
                      <div className="font-medium text-foreground">
                        {new Date(getEffectiveStartDate()).toLocaleDateString()} - {new Date(getEndDate()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">{t("pricing.note")}</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={
                  submitting ||
                  availableSlots === 0 ||
                  (type === "coupon" && (!selectedBatchId || !hasAvailableBatches))
                }
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("buttons.submit")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
