/**

 * Funds Verifier professional text capitalization.

 * - Capitalizes the first letter of the text

 * - Capitalizes the first letter after . ! ?

 * - For titles / short labels: also capitalizes the first letter of each word

 * Does not force-lowercase other letters (preserves acronyms like UAE, DLD).

 */



const SENTENCE_FIELD_NAMES = new Set([

  'description',

  'additionaldescription',

  'about',

  'message',

  'notes',

  'comment',

  'comments',

])



/** Short labels that should title-case every word. */

const TITLE_FIELD_NAMES = new Set([

  'title',

  'developer',

  'milestone',

  'paymenttitle',

  'neighbourhood',

  'neighborhood',

  'name',

  'lastname',

  'fullname',

])



const SKIP_FIELD_NAMES = new Set([

  'price',

  'pricefrom',

  'priceto',

  'email',

  'phone',

  'phonenumber',

  'password',

  'sharepercent',

  'sizesqft',

  'sizesqm',

  'sizesqftfrom',

  'sizesqftto',

  'sizesqmfrom',

  'sizesqmto',

  'roi',

  'advertisementid',

  'dldnumber',

  'url',

  'link',

  'mapurl',

  'video3dwalkthrough',

  'paymentplantype',

  'paymentplantypecustom',

  'mileageunit',

  'capacityweightunit',

  'weightunit',

])



/** Sentence case: first letter + first letter after . ! ? */

export function autoCapitalizeSentence(input) {

  if (typeof input !== 'string' || input.length === 0) return input



  let capitalizeNext = true

  let result = ''



  for (let i = 0; i < input.length; i++) {

    const ch = input[i]



    if (capitalizeNext && /[a-z]/i.test(ch)) {

      result += ch.toUpperCase()

      capitalizeNext = false

      continue

    }



    result += ch



    if (/[.!?]/.test(ch)) {

      capitalizeNext = true

    }

  }



  return result

}



/**

 * Title / label case: first letter of each word (and after - / _).

 * Also capitalizes after . ! ? for multi-sentence titles.

 */

export function autoCapitalizeTitle(input) {

  if (typeof input !== 'string' || input.length === 0) return input



  let capitalizeNext = true

  let result = ''



  for (let i = 0; i < input.length; i++) {

    const ch = input[i]



    if (capitalizeNext && /[a-z]/i.test(ch)) {

      result += ch.toUpperCase()

      capitalizeNext = false

      continue

    }



    result += ch



    if (/[\s\-_/]/.test(ch) || /[.!?]/.test(ch)) {

      capitalizeNext = true

    }

  }



  return result

}



function normalizeFieldName(name) {

  return String(name || '')

    .trim()

    .toLowerCase()

    .replace(/[^a-z0-9]/g, '')

}



/**

 * Pick capitalization style from field name.

 * Title → every word; descriptions → sentence case; other text → title case.

 */

export function autoCapitalizeField(name, value) {

  if (typeof value !== 'string') return value



  const key = normalizeFieldName(name)

  if (!key || SKIP_FIELD_NAMES.has(key)) return value



  if (SENTENCE_FIELD_NAMES.has(key)) {

    return autoCapitalizeSentence(value)

  }



  // Explicit title fields + default for other short text fields

  if (TITLE_FIELD_NAMES.has(key) || key === 'title') {

    return autoCapitalizeTitle(value)

  }



  return autoCapitalizeTitle(value)

}



/**

 * Wrap a change event so text fields auto-capitalize before reaching form state.

 * Uses a plain { target: { name, value } } so handlers that read e.target always get the capitalized value.

 */

export function withAutoCapitalizeChange(event, handleChange) {

  if (typeof handleChange !== 'function') return



  const name = event?.target?.name

  const value = event?.target?.value



  if (typeof value !== 'string') {

    handleChange(event)

    return

  }



  const nextValue = autoCapitalizeField(name, value)



  handleChange({

    ...event,

    target: {

      name,

      value: nextValue,

    },

  })

}


