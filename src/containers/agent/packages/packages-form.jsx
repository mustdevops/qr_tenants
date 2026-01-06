"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/helper/Loader";
import { toast } from "sonner";
import { Save, Package, StepBack, ArrowLeft } from "lucide-react";
import axiosInstance from "@/lib/axios";
import {
  TextField,
  NumberField,
  SelectField,
  TextareaField,
} from "@/components/form-fields";

const creditTypeOptions = [
  { value: "general", label: "General" },
  { value: "review", label: "Review" },
  { value: "utility", label: "Utility" },
  { value: "marketing", label: "Marketing" },
  { value: "festivals", label: "Festivals (Birthday, etc)" },
  { value: "custom", label: "Custom" },
];

export default function PackageForm({ isEdit = false, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const packageId = isEdit ? params?.id : undefined;
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      credits: "",
      bonusCredits: 0,
      pricePerCredit: "",
      currency: "USD",
      creditType: "general",
      customCreditType: "",
      merchantType: "temporary",
      sortOrder: 1,
      isActive: "true",
    },
  });

  const price = watch("price");
  const credits = watch("credits");
  const selectedCreditType = watch("creditType");
  const pricePerCredit = watch("pricePerCredit");

  useEffect(() => {
    if (!price || !credits) return;

    if (!pricePerCredit) {
      const calculated = (Number(price) / Number(credits)).toFixed(2);
      setValue("pricePerCredit", calculated);
    }
  }, [price, credits, pricePerCredit, setValue]);

  useEffect(() => {
    if (!isEdit || !packageId) return;

    const fetchPackage = async () => {
      try {
        const res = await axiosInstance.get(
          `/wallets/credit-packages/${packageId}`
        );
        const data = res?.data?.data;
        if (!data) return;

        reset({
          name: data.name,
          description: data.description,
          price: data.price,
          credits: data.credits,
          bonusCredits: data.bonus_credits || 0,
          currency: data.currency,
          creditType: creditTypeOptions.some(
            (opt) => opt.value === data.credit_type
          )
            ? data.credit_type
            : "custom",
          customCreditType: creditTypeOptions.some(
            (opt) => opt.value === data.credit_type
          )
            ? ""
            : data.credit_type,
          merchantType: data.merchant_type,
          sortOrder: data.sort_order,
          isActive: data.is_active ? "true" : "false",
        });
      } catch {
        toast.error("Failed to load package details");
      }
    };

    fetchPackage();
  }, [isEdit, packageId, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const finalCreditType =
        data.creditType === "custom" ? data.customCreditType : data.creditType;

      const payload = {
        name: data.name,
        description: data.description,
        credits: Number(data.credits),
        credit_type: finalCreditType,
        price: Number(data.price),
        price_per_credit: Number(data.price) / Number(data.credits),
        currency: data.currency,
        merchant_type: data.merchantType,
        admin_id: session?.user?.adminId,
        is_active: data.isActive === "true",
        sort_order: Number(data.sortOrder),
        bonus_credits: Number(data.bonusCredits || 0),
      };

      if (isEdit && packageId) {
        await axiosInstance.patch(
          `/wallets/credit-packages/${packageId}`,
          payload
        );
      } else {
        await axiosInstance.post("/wallets/credit-packages", payload);
      }

      toast.success(
        isEdit ? "Package updated successfully" : "Package created successfully"
      );

      onSuccess?.();
      if (!isEdit) reset();
      router.push("/agent/packages");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} package`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-start mt-10 px-4"
    >
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Left side: icon + title/description */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {isEdit ? "Edit Credit Package" : "Create Credit Package"}
                </CardTitle>
                <CardDescription>
                  Configure pricing, credits, and availability.
                </CardDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/agent/packages")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Package Name"
              name="name"
              register={register}
              errors={errors}
              validation={{ required: "Package name is required" }}
            />

            <NumberField
              label="Price"
              name="price"
              register={register}
              errors={errors}
              validation={{ required: "Price is required", min: 1 }}
            />
          </div>

          <TextareaField
            label="Description"
            name="description"
            register={register}
            errors={errors}
          />

          {/* Credits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField
              label="Credits"
              name="credits"
              register={register}
              errors={errors}
              validation={{ required: "Credits are required", min: 1 }}
            />

            <NumberField
              label="Bonus Credits"
              name="bonusCredits"
              register={register}
              errors={errors}
            />

            <NumberField
              label="Sort Order"
              name="sortOrder"
              register={register}
              errors={errors}
              validation={{ required: true }}
            />
          </div>

          {/* Selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Currency"
              name="currency"
              control={control}
              errors={errors}
              options={[
                { value: "USD", label: "USD" },
                { value: "PKR", label: "PKR" },
              ]}
            />

            <SelectField
              label="Credit Type"
              name="creditType"
              control={control}
              errors={errors}
              options={creditTypeOptions}
            />

            <SelectField
              label="Merchant Type"
              name="merchantType"
              control={control}
              errors={errors}
              options={[
                { value: "temporary", label: "Temporary" },
                { value: "annual", label: "Annual" },
              ]}
            />
          </div>

          {/* Custom Credit Type */}
          {selectedCreditType === "custom" && (
            <TextField
              label="Custom Credit Type"
              name="customCreditType"
              placeholder="e.g. Birthday, Anniversary"
              register={register}
              errors={errors}
              validation={{ required: "Custom credit type is required" }}
            />
          )}

          {/* Price per credit (readonly) */}
          <NumberField
            label="Price per Credit"
            name="pricePerCredit"
            register={register}
            errors={errors}
            validation={{
              required: "Price per credit is required",
              min: 0.01,
            }}
          />

          {/* Status */}
          <SelectField
            label="Status"
            name="isActive"
            control={control}
            errors={errors}
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
        </CardContent>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <LoadingSpinner className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Update Package" : "Create Package"}
              </>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}
