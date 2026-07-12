import React from 'react';
import { useForm } from 'react-hook-form';
import { Car, Tag, DollarSign, Package, Loader2 } from 'lucide-react';
import FormField from '../common/FormField';
import SelectField from '../common/SelectField';
import { VEHICLE_CATEGORIES } from '../../services/vehicleService';

const CATEGORY_OPTIONS = VEHICLE_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat,
}));

export default function VehicleForm({ initialData = null, onSubmit, isSubmitting = false, onCancel }) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      category: initialData?.category || 'SEDAN',
      price: initialData?.price || '',
      quantity: initialData?.quantity ?? 1,
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      make: data.make.trim(),
      model: data.model.trim(),
      category: data.category,
      price: Number(data.price),
      quantity: Number(data.quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="vehicle-make"
          label="Make"
          placeholder="e.g. Tata"
          icon={Car}
          registration={register('make', {
            required: 'Make is required',
            minLength: { value: 2, message: 'Make must be at least 2 characters' },
          })}
          error={errors.make}
        />

        <FormField
          id="vehicle-model"
          label="Model"
          placeholder="e.g. Nexon"
          icon={Tag}
          registration={register('model', {
            required: 'Model is required',
            minLength: { value: 1, message: 'Model is required' },
          })}
          error={errors.model}
        />
      </div>

      <SelectField
        id="vehicle-category"
        label="Category"
        options={CATEGORY_OPTIONS}
        registration={register('category', {
          required: 'Category is required',
        })}
        error={errors.category}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="vehicle-price"
          label="Ex-Showroom Price (INR ₹)"
          type="number"
          placeholder="1450000"
          icon={DollarSign}
          registration={register('price', {
            required: 'Price is required',
            min: { value: 0.01, message: 'Price must be strictly positive' },
          })}
          error={errors.price}
        />

        <FormField
          id="vehicle-quantity"
          label="Initial Stock Quantity"
          type="number"
          placeholder="1"
          icon={Package}
          registration={register('quantity', {
            required: 'Quantity is required',
            min: { value: 0, message: 'Quantity cannot be negative' },
          })}
          error={errors.quantity}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 text-sm font-medium text-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-gray-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}
