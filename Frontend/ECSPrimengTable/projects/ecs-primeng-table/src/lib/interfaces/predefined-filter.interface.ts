/**
 * Represents a predefined filter value for a column in **ECS PrimeNG tables**.
 * 
 * Allows displaying a value as text, tag, icon or image (from URL or blob) with optional styles and colors.
 */
export interface IPredefinedFilter {
    /**
     * The underlying value of the cell. Must match the data returned from the backend for proper filtering and mapping.
     * 
     * This is also used by the global filter internally.
     * 
     * **IMPORTANT**: For text and tag representations, it is recommended that `value` matches `name`.
     */
    value: string | number;

    /**
     * The text displayed in the frontend for this filter value.
     * 
     * Used when `displayName` is `true` or when displaying a tag.
     */
    name?: string;

    /**
     * Set to `true` to display the `name` as text in the cell.
     */
    displayName?: boolean;

    /**
     * Set to `true` to display the `name` as a tag in the cell.
     */
    displayTag?: boolean

    /**
     * Optional CSS style object to apply to the tag.
     * 
     * Example: { background: 'rgb(255,0,0)', color: 'white' }
     */
    tagStyle?: { [key: string]: string }

    /**
     * The icon to display for this value.
     * 
     * Can use icons from PrimeNG, Font Awesome, Material Icons, etc...
     */
    icon?: string;

    /**
     * Optional color to apply to the icon.
     * 
     * Example: "red", "#00ff00"
     */
    iconColor?: string;

    /**
     * Optional CSS style string to apply to the icon.
     * 
     * Example: "font-size: 1.5rem" "margin-right: 0.5rem"
     */
    iconStyle?: string;

    /** 
     * The image to display directly from a URL.
     */
    imageURL?: string;

    /** 
     * The image to display from a Blob object.
     */
    imageBlob?: Blob;

    /** 
     * If using a Blob and it is not provided directly, the backend endpoint to fetch the Blob from.
     */
    imageBlobSourceEndpoint?: string;

    /** 
     * @internal
     * Indicates that fetching the Blob from `imageBlobSourceEndpoint` failed.
     * 
     * **_Do not modify this property manually._**
     */
    imageBlobFetchError?: boolean;
}